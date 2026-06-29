import { Outlet } from 'react-router-dom';
import { Moon, Package, Sun } from '@phosphor-icons/react';
import { useTheme } from '@/hooks/useTheme';
import styles from './Layout.module.css';

export default function Layout() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={styles.layout}>
      <nav className={styles.nav}>
        <div className={styles.navLeft}>
          <div className={styles.brand}>
            <Package className={styles.brandIcon} size={22} weight="duotone" />
            <span>Cathay Cargo — Smart Scanning</span>
          </div>
        </div>

        <div className={styles.navRight}>
          <button
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </nav>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
