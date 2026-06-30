import { Database } from '@phosphor-icons/react';
import type { DatabaseStatus, SystemComponentStatus } from '@/types';
import ComponentIcon from '@/components/ComponentIcon/ComponentIcon';
import StatusPill from '@/components/StatusPill/StatusPill';
import styles from './CompactHealth.module.css';

interface CompactHealthProps {
  components: SystemComponentStatus[];
  database: DatabaseStatus;
}

export default function CompactHealth({ components, database }: CompactHealthProps) {
  return (
    <div className={styles.healthStrip}>
      {components.map((component) => (
        <div key={component.id} className={styles.healthItem}>
          <ComponentIcon name={component.icon} size={18} />
          <span className={styles.name} title={component.name}>
            {component.name}
          </span>
          <StatusPill indicator={component.indicator} />
        </div>
      ))}
      <div className={styles.healthItem}>
        <Database className={styles.icon} size={18} weight="duotone" />
        <span className={styles.name} title={database.name}>
          Database
        </span>
        <StatusPill indicator={database.indicator} />
      </div>
    </div>
  );
}
