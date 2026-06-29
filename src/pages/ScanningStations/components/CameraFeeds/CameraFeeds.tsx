import styles from './CameraFeeds.module.css';

const FEEDS = [
  { id: 'measurement', title: 'Measurement Device Feed' },
  { id: 'pallet', title: 'Pallet ID Camera Feed' },
];

export default function CameraFeeds() {
  return (
    <div className={styles.scanningSection}>
      {FEEDS.map((feed) => (
        <div key={feed.id} className={styles.cameraContainer}>
          <h4 className={styles.cameraTitle}>{feed.title}</h4>
          <div className={styles.cameraView}>
            <span className={styles.placeholderText}>No feed available</span>
          </div>
        </div>
      ))}
    </div>
  );
}
