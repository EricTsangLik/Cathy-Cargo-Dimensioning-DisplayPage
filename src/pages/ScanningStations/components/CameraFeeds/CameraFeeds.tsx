import { useState } from 'react';
import type { CameraFeed } from '@/types';
import styles from './CameraFeeds.module.css';

const DEFAULT_FEEDS: CameraFeed[] = [
  { id: 'measurement', title: 'Measurement Device Feed' },
  { id: 'pallet', title: 'Pallet ID Camera Feed' },
];

interface CameraFeedsProps {
  feeds?: CameraFeed[];
}

export default function CameraFeeds({ feeds = DEFAULT_FEEDS }: CameraFeedsProps) {
  const [failedPaths, setFailedPaths] = useState<Set<string>>(() => new Set());

  return (
    <div className={styles.scanningSection}>
      {feeds.map((feed) => {
        const hasLoadablePath = feed.path && !failedPaths.has(feed.path);

        return (
          <div key={feed.id} className={styles.cameraContainer}>
            <h4 className={styles.cameraTitle}>{feed.title}</h4>
            <div className={styles.cameraView}>
              {hasLoadablePath ? (
                <img
                  className={styles.feedImage}
                  src={feed.path}
                  alt={feed.title}
                  onError={() => {
                    if (!feed.path) return;
                    setFailedPaths((current) => new Set(current).add(feed.path as string));
                  }}
                />
              ) : (
                <span className={styles.placeholderText}>
                  {feed.path ? 'Image path received' : 'No feed available'}
                </span>
              )}
              {feed.path ? (
                <span className={styles.pathLabel} title={feed.path}>
                  {feed.path}
                </span>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
