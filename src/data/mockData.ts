import type {
  DatabaseStatus,
  FreightInfo,
  Scan,
  StatusLog,
  SystemComponentStatus,
} from '@/types';

export const DEVICE_ID = 'ST-01';

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
    const ts = new Date(now.getTime() - i * 3 * 60 * 1000 - Math.random() * 60000);
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
