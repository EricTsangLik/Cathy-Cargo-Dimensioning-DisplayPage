export type HealthStatus = 'ok' | 'warning' | 'error';

export interface Scan {
  id: string;
  timestamp: Date;
  dims: string;
  vol: string;
  status: HealthStatus;
}

export interface FreightInfo {
  deviceId: string;
  palletId: string;
  length: number;
  width: number;
  height: number;
  actualVolume: number;
}

export interface SystemComponentStatus {
  id: string;
  name: string;
  icon: string;
  status: HealthStatus;
  detail?: string;
  sidebarDetail: string;
  indicator: string;
  details: string[];
  cameras?: {
    id: string;
    label: string;
    status: HealthStatus;
  }[];
}

export interface DatabaseStatus {
  name: string;
  indicator: 'Online' | 'Offline';
  status: HealthStatus;
  details: string[];
}

export interface StatusLog {
  id: string;
  timestamp: Date;
  multiViewStatus: HealthStatus;
  palletIdStatus: HealthStatus;
  measurementStatus: HealthStatus;
  triggerSensorsStatus: HealthStatus;
  databaseStatus: HealthStatus;
  offlineCameras?: string[];
  offlineSensors?: string[];
}

export type PhosphorIconName =
  | 'Camera'
  | 'Barcode'
  | 'Ruler'
  | 'Lightning'
  | 'Database'
  | 'VideoCamera';
