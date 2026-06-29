import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages: total,
  pageSize,
  totalItems,
  onPageChange,
}: PaginationProps) {
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className={styles.pagination}>
      <span className={styles.info}>
        {totalItems === 0
          ? 'No items'
          : `${start}–${end} of ${totalItems}`}
      </span>
      <div className={styles.controls}>
        <button
          className={styles.btn}
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
        >
          <CaretLeft size={16} weight="bold" />
        </button>
        <span className={styles.pageNum}>
          {currentPage} / {total}
        </span>
        <button
          className={styles.btn}
          disabled={currentPage >= total}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
        >
          <CaretRight size={16} weight="bold" />
        </button>
      </div>
    </div>
  );
}
