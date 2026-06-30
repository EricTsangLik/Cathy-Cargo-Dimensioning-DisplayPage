import type {
  CameraFeed,
  DatabaseStatus,
  FreightInfo,
  HealthStatus,
  MeasurementRecord,
  MeasurementSocketEvent,
  Scan,
  StationHealthSocketEvent,
  StationHealthStatus,
  SystemComponentStatus,
} from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? '';
const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL?.replace(/\/$/, '');
const DEFAULT_STATION_ID = 'STATION-01';
const DUMMY_DEPTH_IMAGE_PATH = '/dummy-measurement.svg';
const DUMMY_OCR_IMAGE_PATH = '/dummy-pallet-id.svg';
const MOCK_STATUSES: Array<'up' | 'down'> = ['up', 'up', 'up', 'up', 'down'];

function apiPath(path: string): string {
  return `${API_BASE_URL}${path}`;
}

function wsPath(path: string): string {
  if (WS_BASE_URL) {
    return `${WS_BASE_URL}${path}`;
  }

  if (API_BASE_URL) {
    return `${API_BASE_URL.replace(/^http/, 'ws')}${path}`;
  }

  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  return `${protocol}://${window.location.host}${path}`;
}

function toHealthStatus(status: StationHealthStatus[keyof StationHealthStatus]): HealthStatus {
  return status === 'up' ? 'ok' : 'error';
}

function getGroupStatus(statuses: HealthStatus[]): HealthStatus {
  return statuses.some((status) => status === 'error') ? 'error' : 'ok';
}

function getIndicator(status: HealthStatus): 'Online' | 'Offline' {
  return status === 'ok' ? 'Online' : 'Offline';
}

function imageUrl(path?: string): string | undefined {
  if (!path) return undefined;
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path;
  if (path.startsWith('/dummy-')) return path;
  return API_BASE_URL ? `${API_BASE_URL}${path}` : path;
}

function findImagePath(measurement: MeasurementRecord, type: 'ocr' | 'depth'): string | undefined {
  const images = measurement.images ?? [];
  const explicit = images.find((image) => image.image_type.toLowerCase().includes(type));
  if (explicit) return imageUrl(explicit.path);

  const inferred = images.find((image) => image.path.toLowerCase().includes(type));
  if (inferred) return imageUrl(inferred.path);

  return type === 'ocr' ? imageUrl(images[0]?.path) : imageUrl(images[1]?.path);
}

export async function fetchRecentMeasurements(limit = 20): Promise<MeasurementRecord[]> {
  const response = await fetch(apiPath(`/measurements/recent?limit=${limit}`));
  if (!response.ok) {
    throw new Error('Failed to load recent measurements');
  }
  return response.json();
}

export async function fetchCurrentStationHealth(): Promise<StationHealthStatus[]> {
  const response = await fetch(apiPath('/station-health/current'));
  if (!response.ok) {
    throw new Error('Failed to load current station health');
  }
  return response.json();
}

export function getMeasurementWebSocketUrl(): string {
  return wsPath('/ws/measurements');
}

export function getStationHealthWebSocketUrl(): string {
  return wsPath('/ws/station-health');
}

export function mapMeasurementEvent(data: unknown): MeasurementRecord | null {
  const event = data as Partial<MeasurementSocketEvent>;
  if (event.type !== 'measurement.created' || !event.measurement) {
    return null;
  }
  return event.measurement;
}

export function mapStationHealthEvent(data: unknown): StationHealthStatus | null {
  const event = data as Partial<StationHealthSocketEvent>;
  if (event.type !== 'station_health.changed' || !event.station_health) {
    return null;
  }
  return event.station_health;
}

export function mapMeasurementToFreight(
  measurement: MeasurementRecord,
  previous: FreightInfo,
): FreightInfo {
  return {
    ...previous,
    deviceId: measurement.scanner_name || `Scanner-${measurement.scanner_id}`,
    palletId: measurement.palette_id,
    length: measurement.length ?? previous.length,
    width: measurement.width ?? previous.width,
    height: measurement.height ?? previous.height,
    actualVolume: measurement.measurement_result * 1000,
  };
}

export function mapMeasurementToScan(measurement: MeasurementRecord): Scan {
  const dims =
    measurement.length && measurement.width && measurement.height
      ? `${measurement.length} × ${measurement.width} × ${measurement.height}`
      : '-';

  return {
    id: measurement.palette_id,
    timestamp: new Date(measurement.created_at),
    dims,
    vol: measurement.measurement_result.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    status: 'ok',
    imagePaths: measurement.images.map((image) => imageUrl(image.path) ?? image.path),
  };
}

export function mapMeasurementToFeeds(measurement?: MeasurementRecord): CameraFeed[] {
  return [
    {
      id: 'depth',
      title: 'Measurement Device Feed',
      path: measurement ? findImagePath(measurement, 'depth') : DUMMY_DEPTH_IMAGE_PATH,
      fallbackPath: DUMMY_DEPTH_IMAGE_PATH,
    },
    {
      id: 'ocr',
      title: 'Pallet ID Camera Feed',
      path: measurement ? findImagePath(measurement, 'ocr') : DUMMY_OCR_IMAGE_PATH,
      fallbackPath: DUMMY_OCR_IMAGE_PATH,
    },
  ];
}

export function mapStationHealthToComponents(
  stationHealth: StationHealthStatus,
): { components: SystemComponentStatus[]; database: DatabaseStatus } {
  const cameraStatuses = [
    stationHealth.rgb_camera_1_status,
    stationHealth.rgb_camera_2_status,
    stationHealth.rgb_camera_3_status,
    stationHealth.rgb_camera_4_status,
    stationHealth.rgb_camera_5_status,
    stationHealth.rgb_camera_6_status,
    stationHealth.rgb_camera_7_status,
    stationHealth.rgb_camera_8_status,
  ].map(toHealthStatus);
  const cameraOnlineCount = cameraStatuses.filter((status) => status === 'ok').length;
  const multiViewStatus = getGroupStatus(cameraStatuses);

  const sensorStatuses = [
    stationHealth.trigger_sensor_1_status,
    stationHealth.trigger_sensor_2_status,
    stationHealth.trigger_sensor_3_status,
  ].map(toHealthStatus);
  const sensorOnlineCount = sensorStatuses.filter((status) => status === 'ok').length;
  const triggerStatus = getGroupStatus(sensorStatuses);

  const palletIdStatus = toHealthStatus(stationHealth.ocr_camera_status);
  const measurementStatus = toHealthStatus(stationHealth.depth_camera_status);
  const databaseStatus = toHealthStatus(stationHealth.database_status);

  return {
    components: [
      {
        id: 'multi-view',
        name: 'Multi-view Cameras',
        icon: 'Camera',
        indicator: getIndicator(multiViewStatus),
        status: multiViewStatus,
        sidebarDetail: `${cameraOnlineCount} cameras active`,
        details: [`${cameraOnlineCount} of 8 cameras active`],
        cameras: cameraStatuses.map((status, index) => ({
          id: `cam-${index + 1}`,
          label: `Cam ${index + 1}`,
          status,
        })),
      },
      {
        id: 'pallet-id',
        name: 'Pallet ID Camera',
        icon: 'Barcode',
        indicator: getIndicator(palletIdStatus),
        status: palletIdStatus,
        sidebarDetail: getIndicator(palletIdStatus),
        details: [`Status: ${getIndicator(palletIdStatus)}`],
      },
      {
        id: 'measurement',
        name: 'Measurement Device',
        icon: 'Ruler',
        indicator: getIndicator(measurementStatus),
        status: measurementStatus,
        sidebarDetail: getIndicator(measurementStatus),
        details: [`Status: ${getIndicator(measurementStatus)}`],
      },
      {
        id: 'trigger-sensors',
        name: 'Trigger Sensors',
        icon: 'Lightning',
        indicator: getIndicator(triggerStatus),
        status: triggerStatus,
        sidebarDetail: `${sensorOnlineCount} sensors active`,
        details: [`${sensorOnlineCount} of 3 sensors active`],
        cameras: sensorStatuses.map((status, index) => ({
          id: `sens-${index + 1}`,
          label: `Sensor ${index + 1}`,
          status,
        })),
      },
    ],
    database: {
      name: `${stationHealth.station_id} Database`,
      indicator: getIndicator(databaseStatus),
      status: databaseStatus,
      details: [`Status: ${getIndicator(databaseStatus)}`],
    },
  };
}

export function selectStationHealth(
  statuses: StationHealthStatus[],
  stationId = DEFAULT_STATION_ID,
): StationHealthStatus | undefined {
  return statuses.find((status) => status.station_id === stationId) ?? statuses[0];
}

export function createMockMeasurement(sequence: number): MeasurementRecord {
  const now = new Date();
  const length = 1100 + (sequence % 5) * 25;
  const width = 760 + (sequence % 4) * 20;
  const height = 920 + (sequence % 6) * 18;
  const volumeCm3 = (length * width * height) / 1000;
  const ocrImagePath = `/mock-images/ocr/${sequence}.svg`;
  const depthImagePath = `/mock-images/depth/${sequence}.svg`;

  return {
    id: sequence,
    palette_id: `PLT-DEMO-${String(sequence).padStart(4, '0')}`,
    measurement_result: volumeCm3,
    scanner_id: 1,
    scanner_name: 'ST-01',
    length,
    width,
    height,
    images: [
      {
        id: sequence * 2,
        path: ocrImagePath,
        image_type: 'OCR',
        created_at: now.toISOString(),
      },
      {
        id: sequence * 2 + 1,
        path: depthImagePath,
        image_type: 'Depth',
        created_at: now.toISOString(),
      },
    ],
    created_at: now.toISOString(),
  };
}

export function createMockStationHealth(sequence: number): StationHealthStatus {
  const now = new Date().toISOString();
  const pickedStatus = MOCK_STATUSES[sequence % MOCK_STATUSES.length];

  return {
    id: sequence,
    station_id: DEFAULT_STATION_ID,
    rgb_camera_1_status: 'up',
    rgb_camera_2_status: pickedStatus,
    rgb_camera_3_status: 'up',
    rgb_camera_4_status: 'up',
    rgb_camera_5_status: 'up',
    rgb_camera_6_status: 'up',
    rgb_camera_7_status: 'up',
    rgb_camera_8_status: 'up',
    depth_camera_status: 'up',
    ocr_camera_status: 'up',
    trigger_sensor_1_status: 'up',
    trigger_sensor_2_status: 'up',
    trigger_sensor_3_status: pickedStatus,
    database_status: 'up',
    log_type: 'periodic',
    description: pickedStatus === 'up' ? 'all monitored devices are up' : 'demo status change',
    captured_at: now,
    created_at: now,
  };
}
