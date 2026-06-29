import type { Scan } from '@/types';
import { formatTime } from '@/hooks/useClock';

export function exportScansToCsv(scans: Scan[], filename = 'scan-history.csv') {
  const headers = ['Timestamp', 'Pallet ID', 'Dimensions (L×W×H) mm', 'Actual Volume (cm³)', 'Status'];
  const rows = scans.map((scan) => [
    formatTime(scan.timestamp),
    scan.id,
    scan.dims,
    scan.vol,
    scan.status.toUpperCase(),
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function paginate<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export function totalPages(itemCount: number, pageSize: number): number {
  return Math.max(1, Math.ceil(itemCount / pageSize));
}

export function formatVolumeCm3(volumeMm3: number): string {
  const cm3 = volumeMm3 / 1000;
  return cm3.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function getOverallSystemStatus(
  components: { status: string }[],
  database: { status: string },
): 'ok' | 'warning' | 'error' {
  const all = [...components.map((c) => c.status), database.status];
  if (all.includes('error')) return 'error';
  if (all.includes('warning')) return 'warning';
  return 'ok';
}

export function getOverallStatusLabel(status: 'ok' | 'warning' | 'error'): string {
  switch (status) {
    case 'ok':
      return 'All Systems Operational';
    case 'warning':
      return 'Degraded Performance';
    case 'error':
      return 'System Issues Detected';
  }
}

export function getStatusTooltip(
  status: string,
  offlineCameras?: string[],
  offlineSensors?: string[],
): string | undefined {
  if (status === 'ok') return undefined;
  const parts: string[] = [];
  if (offlineCameras?.length) {
    parts.push(`Offline: ${offlineCameras.join(', ')}`);
  }
  if (offlineSensors?.length) {
    parts.push(`Offline: ${offlineSensors.join(', ')}`);
  }
  if (parts.length === 0) {
    return status === 'error' ? 'Component offline' : 'Component warning';
  }
  return parts.join('; ');
}
