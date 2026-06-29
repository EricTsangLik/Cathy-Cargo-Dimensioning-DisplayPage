import type { HealthStatus } from '@/types';
import styles from './StatusBadge.module.css';

interface StatusBadgeProps {
  status: HealthStatus;
}

const LABELS: Record<HealthStatus, string> = {
  ok: 'Pass',
  warning: 'Warning',
  error: 'Fail',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[status]}`}>
      {LABELS[status]}
    </span>
  );
}
