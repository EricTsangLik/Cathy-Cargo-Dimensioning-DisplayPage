import { useEffect, useMemo, useRef, useState } from 'react';
import {
  mockComponents,
  mockDatabase,
  mockFreightInfo,
  mockScans,
} from '@/mocks';
import type { DatabaseStatus, FreightInfo, MeasurementRecord, Scan, SystemComponentStatus } from '@/types';
import {
  createMockMeasurement,
  createMockStationHealth,
  fetchCurrentStationHealth,
  fetchLatestStationConfiguration,
  fetchRecentMeasurements,
  getMeasurementWebSocketUrl,
  getStationHealthWebSocketUrl,
  mapMeasurementEvent,
  mapMeasurementToFeeds,
  mapMeasurementToFreight,
  mapMeasurementToScan,
  mapStationHealthEvent,
  mapStationHealthToComponents,
  selectStationHealth,
} from '@/services/scanningStationService';

const MAX_SCANS = 100;
const LIVE_UPDATE_INTERVAL_MS = 5000;
const RECONNECT_DELAY_MS = 15000;

type SocketState = 'connecting' | 'connected' | 'offline';

export function useScanningStationRealtime() {
  const [freight, setFreight] = useState<FreightInfo>(mockFreightInfo);
  const [components, setComponents] = useState<SystemComponentStatus[]>(mockComponents);
  const [database, setDatabase] = useState<DatabaseStatus>(mockDatabase);
  const [scans, setScans] = useState<Scan[]>(mockScans);
  const [latestMeasurement, setLatestMeasurement] = useState<MeasurementRecord>(() => createMockMeasurement(1));
  const [measurementSocketState, setMeasurementSocketState] = useState<SocketState>('connecting');
  const [stationSocketState, setStationSocketState] = useState<SocketState>('connecting');
  const freightRef = useRef(freight);
  const measurementSocketStateRef = useRef(measurementSocketState);
  const stationSocketStateRef = useRef(stationSocketState);
  const mockSequenceRef = useRef(2);

  useEffect(() => {
    freightRef.current = freight;
  }, [freight]);

  useEffect(() => {
    measurementSocketStateRef.current = measurementSocketState;
  }, [measurementSocketState]);

  useEffect(() => {
    stationSocketStateRef.current = stationSocketState;
  }, [stationSocketState]);

  useEffect(() => {
    const applyMeasurement = (measurement: MeasurementRecord) => {
      setLatestMeasurement(measurement);
      setFreight(mapMeasurementToFreight(measurement, freightRef.current));
      setScans((current) => [mapMeasurementToScan(measurement), ...current].slice(0, MAX_SCANS));
    };

    const timer = window.setInterval(() => {
      const nextSequence = mockSequenceRef.current;
      mockSequenceRef.current += 1;

      if (measurementSocketStateRef.current !== 'connected') {
        applyMeasurement(createMockMeasurement(nextSequence));
      }

      if (stationSocketStateRef.current !== 'connected') {
        const mapped = mapStationHealthToComponents(createMockStationHealth(nextSequence));
        setComponents(mapped.components);
        setDatabase(mapped.database);
      }
    }, LIVE_UPDATE_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetchRecentMeasurements()
      .then((measurements) => {
        if (cancelled || measurements.length === 0) return;
        const [latest] = measurements;
        setLatestMeasurement(latest);
        setFreight((current) => mapMeasurementToFreight(latest, current));
        setScans(measurements.map(mapMeasurementToScan));
      })
      .catch(() => {
        // Keep socket state separate from HTTP bootstrap; the WebSocket can still recover.
      });

    fetchCurrentStationHealth()
      .then((statuses) => {
        if (cancelled) return;
        const status = selectStationHealth(statuses);
        if (!status) return;
        const mapped = mapStationHealthToComponents(status);
        setComponents(mapped.components);
        setDatabase(mapped.database);
      })
      .catch(() => {
        // Keep socket state separate from HTTP bootstrap; the WebSocket can still recover.
      });

    fetchLatestStationConfiguration().catch(() => {
      // Configuration is loaded from the CMS API for ATPS-22, but the current UI has no config field yet.
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let closedByEffect = false;
    let reconnectTimer: number | undefined;
    let socket: WebSocket | undefined;

    const connect = () => {
      setMeasurementSocketState((current) => (current === 'offline' ? current : 'connecting'));
      socket = new WebSocket(getMeasurementWebSocketUrl());

      socket.onopen = () => setMeasurementSocketState('connected');
      socket.onmessage = (event) => {
        const measurement = mapMeasurementEvent(JSON.parse(event.data));
        if (!measurement) return;

        setLatestMeasurement(measurement);
        setFreight(mapMeasurementToFreight(measurement, freightRef.current));
        setScans((current) => [mapMeasurementToScan(measurement), ...current].slice(0, MAX_SCANS));
      };
      socket.onclose = () => {
        if (closedByEffect) return;
        setMeasurementSocketState('offline');
        reconnectTimer = window.setTimeout(connect, RECONNECT_DELAY_MS);
      };
      socket.onerror = () => {
        socket?.close();
      };
    };

    connect();

    return () => {
      closedByEffect = true;
      window.clearTimeout(reconnectTimer);
      socket?.close();
    };
  }, []);

  useEffect(() => {
    let closedByEffect = false;
    let reconnectTimer: number | undefined;
    let socket: WebSocket | undefined;

    const connect = () => {
      setStationSocketState((current) => (current === 'offline' ? current : 'connecting'));
      socket = new WebSocket(getStationHealthWebSocketUrl());

      socket.onopen = () => setStationSocketState('connected');
      socket.onmessage = (event) => {
        const stationHealth = mapStationHealthEvent(JSON.parse(event.data));
        if (!stationHealth) return;

        const mapped = mapStationHealthToComponents(stationHealth);
        setComponents(mapped.components);
        setDatabase(mapped.database);
      };
      socket.onclose = () => {
        if (closedByEffect) return;
        setStationSocketState('offline');
        reconnectTimer = window.setTimeout(connect, RECONNECT_DELAY_MS);
      };
      socket.onerror = () => {
        socket?.close();
      };
    };

    connect();

    return () => {
      closedByEffect = true;
      window.clearTimeout(reconnectTimer);
      socket?.close();
    };
  }, []);

  const feeds = useMemo(() => mapMeasurementToFeeds(latestMeasurement), [latestMeasurement]);

  return {
    freight,
    components,
    database,
    scans,
    feeds,
    socketState: {
      measurements: measurementSocketState,
      stationHealth: stationSocketState,
    },
  };
}
