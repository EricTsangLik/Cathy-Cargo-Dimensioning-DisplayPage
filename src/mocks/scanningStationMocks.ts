import type {
  DatabaseStatus,
  FreightInfo,
  MeasurementRecord,
  Scan,
  StatusLog,
  StationHealthStatus,
  SystemComponentStatus,
} from '@/types';

export const DEVICE_ID = 'ST-01';
export const DEFAULT_STATION_ID = 'STATION-01';
export const MOCK_STATUSES: Array<'up' | 'down'> = ['up', 'up', 'up', 'up', 'down'];

export const mockFreightInfo: FreightInfo = {
  deviceId: DEVICE_ID,
  palletId: 'PLT-20250629-A7K3',
  length: 1200,
  width: 800,
  height: 1000,
  actualVolume: 960000,
};

function generateScans(count: number): Scan[] {
  const statuses: Scan['status'][] = ['ok', 'ok', 'ok', 'warning', 'error'];
  const dims = [
    '1200 × 800 × 1000',
    '1100 × 750 × 950',
    '1300 × 900 × 1100',
    '1050 × 700 × 880',
    '1250 × 850 × 1020',
  ];
  const volumes = ['960.00', '783.38', '1287.00', '646.80', '1083.75'];

  const now = new Date();
  return Array.from({ length: count }, (_, i) => {
    const ts = new Date(now.getTime() - i * 5 * 1000);
    const idx = i % dims.length;
    return {
      id: `PLT-20250629-${String.fromCharCode(65 + (i % 26))}${Math.floor(Math.random() * 9000 + 1000)}`,
      timestamp: ts,
      dims: dims[idx],
      vol: volumes[idx],
      status: statuses[i % statuses.length],
    };
  });
}

export const mockScans: Scan[] = generateScans(87);

export const mockComponents: SystemComponentStatus[] = [
  {
    id: 'multi-view',
    name: 'Multi-view Cameras',
    icon: 'Camera',
    indicator: 'Online',
    status: 'ok',
    sidebarDetail: '8 cameras active',
    details: ['IP: 192.168.1.101', 'Firmware: v3.2.1', '8 cameras active'],
    cameras: [
      { id: 'cam-1', label: 'Cam 1', status: 'ok' },
      { id: 'cam-2', label: 'Cam 2', status: 'ok' },
      { id: 'cam-3', label: 'Cam 3', status: 'ok' },
      { id: 'cam-4', label: 'Cam 4', status: 'ok' },
      { id: 'cam-5', label: 'Cam 5', status: 'ok' },
      { id: 'cam-6', label: 'Cam 6', status: 'ok' },
      { id: 'cam-7', label: 'Cam 7', status: 'ok' },
      { id: 'cam-8', label: 'Cam 8', status: 'ok' },
    ],
  },
  {
    id: 'pallet-id',
    name: 'Pallet ID Camera',
    icon: 'Barcode',
    indicator: 'Online',
    status: 'ok',
    sidebarDetail: 'Resolution: 4K',
    details: ['IP: 192.168.1.102', 'Firmware: v2.4.0', 'Resolution: 4K'],
  },
  {
    id: 'measurement',
    name: 'Measurement Device',
    icon: 'Ruler',
    indicator: 'Online',
    status: 'ok',
    sidebarDetail: 'Accuracy: ±2mm',
    details: ['IP: 192.168.1.103', 'Firmware: v1.8.2', 'Accuracy: ±2mm'],
  },
  {
    id: 'trigger-sensors',
    name: 'Trigger Sensors',
    icon: 'Lightning',
    indicator: 'Online',
    status: 'warning',
    sidebarDetail: '3 sensors configured',
    detail: 'Sensor 3 reporting warning',
    details: ['IP: 192.168.1.104', 'Firmware: v1.1.0', '3 sensors configured'],
    cameras: [
      { id: 'sens-1', label: 'Sensor 1', status: 'ok' },
      { id: 'sens-2', label: 'Sensor 2', status: 'ok' },
      { id: 'sens-3', label: 'Sensor 3', status: 'warning' },
    ],
  },
];

export const mockDatabase: DatabaseStatus = {
  name: 'PostgreSQL — Cargo DB',
  indicator: 'Online',
  status: 'ok',
  details: [
    'Host: db.cathay-cargo.local:5432',
    'Latency: 4ms',
    'Uptime: 99.97%',
  ],
};

function generateStatusLogs(count: number): StatusLog[] {
  const now = new Date();
  return Array.from({ length: count }, (_, i) => {
    const ts = new Date(now.getTime() - i * 4 * 60 * 60 * 1000);
    const hasIssue = i === 3 || i === 7;
    return {
      id: `log-${i}`,
      timestamp: ts,
      multiViewStatus: hasIssue && i === 7 ? 'error' : 'ok',
      palletIdStatus: 'ok',
      measurementStatus: hasIssue && i === 3 ? 'warning' : 'ok',
      triggerSensorsStatus: hasIssue && i === 3 ? 'warning' : 'ok',
      databaseStatus: 'ok',
      offlineCameras: hasIssue && i === 7 ? ['Cam 2', 'Cam 4'] : undefined,
      offlineSensors: hasIssue && i === 3 ? ['Sensor 3'] : undefined,
    };
  });
}

export const mockStatusLogs: StatusLog[] = generateStatusLogs(48);
export const STATUS_LOG_REFRESH_HOURS = 4;

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
