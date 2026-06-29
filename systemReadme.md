# Smart Scanning System - Display Website

## 📌 Project Overview
This project is a standalone display website extracted from the main CMS. It provides real-time monitoring interfaces for the **Scanning Stations** and the **System Status**. The application is designed to be a read-only dashboard for operational visibility.

## 🛠 Tech Stack & Framework
The project should be built using the following modern frontend stack:
* **Framework:** React 18 (with TypeScript)
* **Build Tool:** Vite
* **Routing:** React Router DOM (v6)
* **Styling:** CSS Modules (`.module.css`) for scoped component styling, utilizing CSS Grid and Flexbox for responsive layouts.
* **Icons:** Phosphor Icons (`@phosphor-icons/react`)
* **Date/Time Handling:** Native JavaScript `Date` or a lightweight library (e.g., `date-fns`), with custom hooks for real-time clock updates.

---

## 🎨 Global CSS Variables (`src/assets/styles/index.css`)
To ensure a 100% match, the global CSS variables must be implemented exactly as follows to support the Light/Dark theme toggle.

```css
:root {
  --primary: #0066cc;
  --primary-hover: #0052a3;
  --accent: #28a745;
  --warning: #ffc107;
  --danger: #dc3545;
  --info: #17a2b8;

  --bg-body: #f4f6f8;
  --bg-surface: #ffffff;
  --bg-surface-hover: #f8f9fa;

  --text-main: #1a1a1a;
  --text-muted: #6c757d;
  --text-on-primary: #ffffff;

  --border-color: #e9ecef;
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.02);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.05);

  --nav-height: 70px;
  --font-main: 'Inter', system-ui, -apple-system, sans-serif;
  --transition-speed: 0.3s;
}

[data-theme='dark'] {
  --primary: #4da6ff;
  --primary-hover: #7abaff;

  --bg-body: #0f1115;
  --bg-surface: #181b21;
  --bg-surface-hover: #22252b;

  --text-main: #e0e0e0;
  --text-muted: #a0a0a0;

  --border-color: #2d3238;
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.2);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
}
```

---

## 🖥 Page 1: Scanning Stations Page (`/scanning-stations`)

### 1. Main Layout (`ScanningStations.module.css`)
* **Animation:** `.viewSection` uses a `fadeIn` animation (0.4s ease-out, `transform: translateY(10px)` to `0`).
* **Header:** `.sectionHeader` has `margin-bottom: 24px`. The `h2` is `font-size: 24px; font-weight: 600;`.
* **Layout Container:** `.layoutContainer` is a CSS Grid: `grid-template-columns: 320px 1fr; gap: 24px; align-items: start;`. Collapses to `1fr` on screens `< 1024px`.
* **Right Content:** `.rightContent` is a flex column with `gap: 24px`.

### 2. Freight Information Sidebar (`FreightInformation.module.css`)
* **Card Container:** `.card` uses `background-color: var(--bg-surface); border-radius: 12px; padding: 24px; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm);`.
* **Title:** `.cardTitle` is `font-size: 18px; font-weight: 600; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid var(--border-color);`.
* **List Items:** `.infoItem` uses Flexbox `justify-content: space-between`, `padding-bottom: 12px`, and a bottom border.
* **Labels:** `.infoLabel` is `color: var(--text-muted); font-size: 16px; font-weight: 500;`.
* **Values:** `.infoValue` is `color: var(--primary); font-size: 18px; font-weight: 600;`.
* **Sub-Info (Dimensions):** `.subInfoList` has `padding-left: 12px; border-left: 2px solid var(--border-color); gap: 8px;`.
* **Volume (Stacked Item):** The actual volume value uses `font-size: 24px; color: var(--primary);`.

### 3. Camera Feeds (`CameraFeeds.module.css`)
* **Grid:** `.scanningSection` uses `grid-template-columns: 1fr 1fr; gap: 24px;`. Collapses to `1fr` on `< 1024px`.
* **Container:** `.cameraContainer` is a card with `padding: 20px; border-radius: 12px; gap: 16px;`.
* **Title:** `.cameraTitle` is `font-size: 16px; font-weight: 600;`.
* **View Area:** `.cameraView` has `aspect-ratio: 16 / 9; border-radius: 8px; overflow: hidden;`.
* **Placeholder:** Uses a repeating linear gradient background to simulate a missing feed.

### 4. Recent Scans Table (`ScanFeedTable.module.css`)
* **Card:** `.tableCard` uses the standard card styling (`padding: 24px; border-radius: 12px;`).
* **Header Actions:** `.headerActions` aligns the Export button to the right.
* **Export Button:** `.exportBtn` uses `background-color: var(--primary); color: var(--text-on-primary); padding: 8px 16px; border-radius: 6px; font-size: 14px; font-weight: 500;`.
* **Table Elements:** `.table` is `width: 100%; border-collapse: collapse;`.
* **Table Cells:** `th` and `td` have `padding: 16px; border-bottom: 1px solid var(--border-color); text-align: left;`.
* **Table Headers:** `th` uses `font-size: 13px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;`.
* **Pallet ID:** The ID is wrapped in a `.mono` class (`font-family: monospace;`).

---

## 📊 Page 2: System Status Page (`/status`)

### 1. Main Layout (`SystemStatus.module.css`)
* **Header Layout:** `.sectionHeader` uses Flexbox `justify-content: space-between; align-items: center; margin-bottom: 24px;`.
* **Date/Time Badge:** `.headerDatetime` uses `background-color: var(--bg-surface); padding: 10px 20px; border-radius: 10px; font-size: 18px; font-weight: 600; gap: 12px; box-shadow: var(--shadow-sm);`. Icons are colored `var(--primary)`.
* **Separator:** The `|` between date and time has `opacity: 0.25; font-weight: 300; font-size: 20px;`.
* **Overall Status:** `.overallStatus` uses `color: var(--accent); background: rgba(40, 167, 69, 0.1); padding: 6px 12px; border-radius: 20px; font-size: 14px; font-weight: 600;`.

### 2. Hardware Status Grid (`HardwareStatusGrid.module.css`)
* **Container:** `.statusContainer` is a flex column with `gap: 32px;`.
* **Section:** `.statusSection` is a card (`padding: 24px; border-radius: 12px;`).
* **Grid:** `.grid` is a flex column with `gap: 20px;`.
* **Device Card:** `.card` uses `background-color: var(--bg-body); padding: 20px; border-radius: 10px; flex-direction: row; align-items: flex-start; transition: transform 0.2s;`. Hovering applies `transform: translateY(-2px);`.
* **Card Header (Left Side):** `.header` is `width: 260px; flex-shrink: 0; color: var(--primary); gap: 12px;`.
* **Status Pill:** `.statusPill` uses `padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; letter-spacing: 0.05em;`.
  * **Online:** `color: var(--accent); background-color: rgba(40, 167, 69, 0.1); border: 1px solid rgba(40, 167, 69, 0.2);`. Dot has `box-shadow: 0 0 6px var(--accent);`.
  * **Offline:** `color: var(--danger); background-color: rgba(220, 53, 69, 0.1); border: 1px solid rgba(220, 53, 69, 0.2);`. Dot has `box-shadow: 0 0 6px var(--danger);`.
* **Details:** `.detail` uses `font-size: 13px; color: var(--text-muted); margin-bottom: 4px;`.
* **Camera Sub-Grid:** `.cameraGrid` uses `grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 16px; padding-top: 16px; border-top: 1px dashed var(--border-color);`.
* **Camera Row:** `.cameraRow` is `padding: 8px 12px; border-radius: 6px; background-color: var(--bg-surface); font-size: 12px; justify-content: space-between;`.

### 3. Status Log Table (`StatusLogSection.module.css`)
* **Section Header:** `.sectionHeader` uses Flexbox `justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 20px;`.
* **Title:** `.title` is `font-size: 18px; font-weight: 600; gap: 8px;`. Icon is `color: var(--primary);`.
* **Refresh Meta:** `.refreshMeta` is `font-size: 12px; color: var(--text-muted); text-align: right; gap: 6px;`.
* **Table Layout:** `.table` uses `padding: 14px 16px;`. Headers use `font-size: 12px; letter-spacing: 0.04em; text-transform: uppercase;`.
* **Status Light:** `.statusLight` is `width: 14px; height: 14px; border-radius: 50%;`.
  * **Up (Green):** `background-color: var(--accent); border-color: rgba(40, 167, 69, 0.4); box-shadow: 0 0 8px var(--accent);`.
  * **Down (Red):** `background-color: var(--danger); border-color: rgba(220, 53, 69, 0.4); box-shadow: 0 0 8px var(--danger); animation: pulse-error 2s infinite;`.
* **Tooltip:** `.tooltip` is positioned absolute above the light (`bottom: 100%; left: 50%; transform: translateX(-50%);`), uses `background-color: #333; color: #fff; font-size: 11px; padding: 6px 10px; border-radius: 4px;`, and appears on hover.

---

## 📦 Core Data Interfaces (TypeScript)
To help the AI generate accurate props and state, use these core interfaces:

```typescript
export type HealthStatus = 'ok' | 'warning' | 'error';

export interface Scan {
  id: string;             // Pallet ID
  timestamp: Date;
  dims: string;           // e.g., "120 × 80 × 100"
  vol: string;            // e.g., "0.96"
  status: HealthStatus;
}

export interface SystemComponentStatus {
  id: string;
  name: string;
  icon: string;           // Maps to a Phosphor Icon
  indicator: 'Online' | 'Offline';
  status: HealthStatus;
  details: string[];      // e.g., ["IP: 192.168.1.100", "v2.1.0"]
  cameras?: { 
    id: string; 
    label: string; 
    status: HealthStatus 
  }[];
}

export interface StatusLog {
  id: string;
  timestamp: Date;
  multiViewStatus: HealthStatus;
  palletIdStatus: HealthStatus;
  measurementStatus: HealthStatus;
  triggerSensorsStatus: HealthStatus;
  databaseStatus: HealthStatus;
  offlineCameras?: string[];
  offlineSensors?: string[];
}
```