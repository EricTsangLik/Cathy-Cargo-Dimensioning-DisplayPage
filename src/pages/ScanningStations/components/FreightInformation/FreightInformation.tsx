import type { FreightInfo } from '@/types';
import { formatVolumeCm3 } from '@/utils/helpers';
import styles from './FreightInformation.module.css';

interface FreightInformationProps {
  freight: FreightInfo;
}

export default function FreightInformation({ freight }: FreightInformationProps) {
  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>Freight Information</h3>

      <div className={styles.infoList}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Device ID</span>
          <span className={styles.infoValue}>{freight.deviceId}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Pallet ID</span>
          <span className={styles.infoValue}>{freight.palletId}</span>
        </div>

        <div className={styles.infoItemStacked}>
          <span className={styles.infoLabel}>Dimensions</span>
          <div className={styles.subInfoList}>
            <div className={styles.subInfoItem}>
              <span className={styles.subInfoLabel}>Length</span>
              <span className={styles.subInfoValue}>{freight.length.toLocaleString()} mm</span>
            </div>
            <div className={styles.subInfoItem}>
              <span className={styles.subInfoLabel}>Width</span>
              <span className={styles.subInfoValue}>{freight.width.toLocaleString()} mm</span>
            </div>
            <div className={styles.subInfoItem}>
              <span className={styles.subInfoLabel}>Height</span>
              <span className={styles.subInfoValue}>{freight.height.toLocaleString()} mm</span>
            </div>
          </div>
        </div>

        <div className={styles.infoItemStacked}>
          <span className={styles.infoLabel}>Actual Volume</span>
          <div>
            <span className={styles.volumeValue}>{formatVolumeCm3(freight.actualVolume)}</span>
            <span className={styles.volumeUnit}>cm³</span>
          </div>
        </div>
      </div>
    </div>
  );
}
