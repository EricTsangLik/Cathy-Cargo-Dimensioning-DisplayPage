import {
  mockComponents,
  mockDatabase,
  mockFreightInfo,
  mockScans,
} from '@/data/mockData';
import FreightInformation from './components/FreightInformation/FreightInformation';
import CompactHealth from './components/CompactHealth/CompactHealth';
import CameraFeeds from './components/CameraFeeds/CameraFeeds';
import ScanFeedTable from './components/ScanFeedTable/ScanFeedTable';
import styles from './ScanningStations.module.css';

export default function ScanningStationsPage() {
  return (
    <section className={styles.viewSection}>
      <header className={styles.sectionHeader}>
      </header>

      <div className={styles.layoutContainer}>
        <FreightInformation freight={mockFreightInfo} />

        <div className={styles.rightContent}>
          <CompactHealth components={mockComponents} database={mockDatabase} />
          <CameraFeeds />
          <ScanFeedTable scans={mockScans} />
        </div>
      </div>
    </section>
  );
}
