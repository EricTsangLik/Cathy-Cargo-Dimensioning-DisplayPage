import type { HealthStatus } from '@/types';
import styles from './StatusLight.module.css';

interface StatusLightProps {
  status: HealthStatus;
  tooltip?: string;
}

export default function StatusLight({ status, tooltip }: StatusLightProps) {
  return (
    <span className={styles.wrapper}>
      <span className={`${styles.statusLight} ${styles[status]}`} />
      {tooltip && <span className={styles.tooltip}>{tooltip}</span>}
    </span>
  );
}
