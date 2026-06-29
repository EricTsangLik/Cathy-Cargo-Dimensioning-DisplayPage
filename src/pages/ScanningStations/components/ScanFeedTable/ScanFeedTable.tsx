import { useState } from 'react';
import { DownloadSimple } from '@phosphor-icons/react';
import type { Scan } from '@/types';
import StatusBadge from '@/components/StatusBadge/StatusBadge';
import Pagination from '@/components/Pagination/Pagination';
import { formatDisplayDate, formatTime, useClock } from '@/hooks/useClock';
import { exportScansToCsv, paginate, totalPages } from '@/utils/helpers';
import styles from './ScanFeedTable.module.css';

const PAGE_SIZE = 20;

interface ScanFeedTableProps {
  scans: Scan[];
}

export default function ScanFeedTable({ scans }: ScanFeedTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const now = useClock();
  const pageScans = paginate(scans, currentPage, PAGE_SIZE);
  const pages = totalPages(scans.length, PAGE_SIZE);

  const handleExport = () => {
    exportScansToCsv(scans, `scans-${formatTime(now).replace(/:/g, '-')}.csv`);
  };

  const handleDownloadPictures = (scanId: string) => {
    alert(`Download pictures for scan: ${scanId}`);
  };

  return (
    <div className={styles.tableCard}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>
          <span className={styles.title}>Recent Scans</span>
          <span className={styles.date}>{formatDisplayDate(now)}</span>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.exportBtn} onClick={handleExport}>
            <DownloadSimple size={16} weight="bold" />
            Export CSV
          </button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Pallet ID</th>
              <th>Dimensions (L×W×H) mm</th>
              <th>Actual Volume</th>
              <th>Status</th>
              <th>Pictures</th>
            </tr>
          </thead>
          <tbody>
            {pageScans.map((scan) => (
              <tr key={`${scan.id}-${scan.timestamp.getTime()}`}>
                <td className={styles.time}>{formatTime(scan.timestamp)}</td>
                <td className={styles.mono}>{scan.id}</td>
                <td className={styles.mono}>{scan.dims}</td>
                <td className={styles.mono}>{scan.vol} cm³</td>
                <td>
                  <StatusBadge status={scan.status} />
                </td>
                <td>
                  <button
                    className={styles.downloadBtn}
                    onClick={() => handleDownloadPictures(scan.id)}
                    aria-label={`Download pictures for ${scan.id}`}
                  >
                    <DownloadSimple size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={pages}
        pageSize={PAGE_SIZE}
        totalItems={scans.length}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
