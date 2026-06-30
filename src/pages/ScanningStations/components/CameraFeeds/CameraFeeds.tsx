import { useState } from 'react';
import type { CameraFeed } from '@/types';
import styles from './CameraFeeds.module.css';

const DEFAULT_FEEDS: CameraFeed[] = [
  {
    id: 'measurement',
    title: 'Measurement Device Feed',
    path: '/dummy-measurement.svg',
    fallbackPath: '/dummy-measurement.svg',
  },
  {
    id: 'pallet',
    title: 'Pallet ID Camera Feed',
    path: '/dummy-pallet-id.svg',
    fallbackPath: '/dummy-pallet-id.svg',
  },
];

interface CameraFeedsProps {
  feeds?: CameraFeed[];
}

export default function CameraFeeds({ feeds = DEFAULT_FEEDS }: CameraFeedsProps) {
  const [failedPaths, setFailedPaths] = useState<Set<string>>(() => new Set());

  return (
    <div className={styles.scanningSection}>
      {feeds.map((feed) => {
        const displayPath =
          feed.path && !failedPaths.has(feed.path) ? feed.path : feed.fallbackPath;

        return (
          <div key={feed.id} className={styles.cameraContainer}>
            <h4 className={styles.cameraTitle}>{feed.title}</h4>
            <div className={styles.cameraView}>
              {displayPath ? (
                <img
                  className={styles.feedImage}
                  src={displayPath}
                  alt={feed.title}
                  onError={() => {
                    setFailedPaths((current) => new Set(current).add(displayPath));
                  }}
                />
              ) : (
                <span className={styles.placeholderText}>
                  {feed.path ? 'Image path received' : 'No feed available'}
                </span>
              )}
              {displayPath ? (
                <span className={styles.pathLabel} title={feed.path ?? displayPath}>
                  {feed.path ?? displayPath}
                </span>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
