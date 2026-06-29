export type HealthStatus = 'ok' | 'warning' | 'error';

export interface Scan {
  id: string;
  timestamp: Date;
  dims: string;
  vol: string;
  status: HealthStatus;
  imagePaths?: string[];
}

export interface FreightInfo {
  deviceId: string;
  palletId: string;
  length: number;
  width: number;
  height: number;
  actualVolume: number;
}

export interface CameraFeed {
  id: string;
  title: string;
  path?: string;
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

export interface MeasurementImage {
  id: number;
  path: string;
  image_type: string;
  created_at: string;
}

export interface MeasurementRecord {
  id: number;
  palette_id: string;
  measurement_result: number;
  scanner_id: number;
  scanner_name: string;
  images: MeasurementImage[];
  created_at: string;
}

export interface MeasurementSocketEvent {
  type: 'measurement.created';
  measurement: MeasurementRecord;
}

export type StationDeviceStatus = 'up' | 'down';
export type StationHealthLogType = 'change' | 'periodic';

export interface StationHealthStatus {
  id: number;
  station_id: string;
  rgb_camera_1_status: StationDeviceStatus;
  rgb_camera_2_status: StationDeviceStatus;
  rgb_camera_3_status: StationDeviceStatus;
  rgb_camera_4_status: StationDeviceStatus;
  rgb_camera_5_status: StationDeviceStatus;
  rgb_camera_6_status: StationDeviceStatus;
  rgb_camera_7_status: StationDeviceStatus;
  rgb_camera_8_status: StationDeviceStatus;
  depth_camera_status: StationDeviceStatus;
  ocr_camera_status: StationDeviceStatus;
  trigger_sensor_1_status: StationDeviceStatus;
  trigger_sensor_2_status: StationDeviceStatus;
  trigger_sensor_3_status: StationDeviceStatus;
  database_status: StationDeviceStatus;
  log_type: StationHealthLogType;
  description: string;
  captured_at: string;
  created_at: string;
}

export interface StationHealthSocketEvent {
  type: 'station_health.changed';
  station_health: StationHealthStatus;
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
