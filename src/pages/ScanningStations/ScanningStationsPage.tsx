import { useScanningStationRealtime } from '@/hooks/useScanningStationRealtime';
import FreightInformation from './components/FreightInformation/FreightInformation';
import CompactHealth from './components/CompactHealth/CompactHealth';
import CameraFeeds from './components/CameraFeeds/CameraFeeds';
import ScanFeedTable from './components/ScanFeedTable/ScanFeedTable';
import styles from './ScanningStations.module.css';

export default function ScanningStationsPage() {
  const { freight, components, database, scans, feeds } = useScanningStationRealtime();

  return (
    <section className={styles.viewSection}>
      <div className={styles.layoutContainer}>
        <FreightInformation freight={freight} />

        <div className={styles.rightContent}>
          <CompactHealth components={components} database={database} />
          <CameraFeeds feeds={feeds} />
          <ScanFeedTable scans={scans} />
        </div>
      </div>
    </section>
  );
}
