import styles from './StatusPill.module.css';

interface StatusPillProps {
  indicator: string;
}

export default function StatusPill({ indicator }: StatusPillProps) {
  const isOnline = indicator.toLowerCase() === 'online';
  const variant = isOnline ? 'online' : 'offline';
  return (
    <span className={`${styles.pill} ${styles[variant]}`}>
      <span className={styles.dot} />
      {indicator}
    </span>
  );
}
