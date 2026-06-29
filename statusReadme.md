# System Status Page - Detailed UI & Architecture Specification

## 📌 Overview
This document provides a 100% comprehensive breakdown of the **System Status Page** (`/status`). It includes the exact React component structure, TypeScript interfaces, and every single CSS property used to style the layout, cards, tables, and micro-interactions (like pulsing lights and tooltips).

---

## 🏗 Component Structure
The page is composed of three main React components:
1. **`SystemStatusPage`** (Main Wrapper)
2. **`HardwareStatusGrid`** (Real-time device health cards)
3. **`StatusLogSection`** (Historical health table)

---

## 🎨 1. Main Page Layout (`SystemStatusPage`)

### React Structure
*   **Wrapper:** `<section className={styles.viewSection}>`
*   **Header:** `<header className={styles.sectionHeader}>`
    *   **Left Side:** Title ("System Status") + DateTime Badge (`<CalendarBlank />` Date `|` `<Clock />` Time).
    *   **Right Side:** Overall Status Badge ("All Systems Operational").

### Exact CSS (`SystemStatus.module.css`)
```css
.viewSection {
  animation: fadeIn 0.4s ease-out;
}

.sectionHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.sectionHeader h2 {
  font-size: 24px;
  font-weight: 600;
}

.headerLeft {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.headerDatetime {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  color: var(--text-main);
  font-weight: 600;
  background-color: var(--bg-surface);
  padding: 10px 20px;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  margin-top: 4px;
}

.headerDatetime svg {
  color: var(--primary);
}

.separator {
  opacity: 0.25;
  font-weight: 300;
  font-size: 20px;
}

.overallStatus {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: var(--accent);
  background: rgba(40, 167, 69, 0.1);
  padding: 6px 12px;
  border-radius: 20px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .sectionHeader {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
```

---

## 🖥 2. Hardware Status Grid (`HardwareStatusGrid`)

### React Structure
*   Splits components into two sections: **Devices Health** and **Database Status**.
*   Maps through `SYSTEM_COMPONENTS`.
*   Each card has a left header (Icon + Name) and a right body (Status Pill + Details + Optional Camera Sub-grid).

### Exact CSS (`HardwareStatusGrid.module.css`)
```css
.statusContainer {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.statusSection {
  background-color: var(--bg-surface);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

.sectionTitle {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--text-main);
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
}

.grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Individual Card Styles */
.card {
  background-color: var(--bg-body);
  border-radius: 10px;
  padding: 20px;
  border: 1px solid var(--border-color);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  color: var(--primary);
  width: 260px;
  flex-shrink: 0;
}

.header h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-main);
}

.body {
  display: flex;
  flex-direction: column;
  flex: 1;
}

/* Status Pills (Online/Offline) */
.indicatorWrapper {
  margin-bottom: 12px;
}

.statusPill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 12px;
  padding: 6px 12px;
  border-radius: 20px;
  letter-spacing: 0.05em;
}

.online {
  color: var(--accent);
  background-color: rgba(40, 167, 69, 0.1);
  border: 1px solid rgba(40, 167, 69, 0.2);
}
.online .dot {
  background-color: var(--accent);
  box-shadow: 0 0 6px var(--accent);
}

.offline {
  color: var(--danger);
  background-color: rgba(220, 53, 69, 0.1);
  border: 1px solid rgba(220, 53, 69, 0.2);
}
.offline .dot {
  background-color: var(--danger);
  box-shadow: 0 0 6px var(--danger);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.detail {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 4px;
}

/* Camera Sub-grid inside Cards */
.cameraGrid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed var(--border-color);
}

.cameraRow {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: 6px;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  font-size: 12px;
}

.cameraRowLeft {
  display: flex;
  align-items: center;
  gap: 8px;
}

.camLabel {
  font-weight: 500;
  color: var(--text-main);
}

.camStatusIndicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
}

.camDot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.camOk { border-color: rgba(40, 167, 69, 0.3); }
.camOk .camDot { background-color: var(--accent); box-shadow: 0 0 6px var(--accent); }

.camError {
  background-color: rgba(220, 53, 69, 0.05);
  border-color: rgba(220, 53, 69, 0.3);
}
.camError svg { color: var(--danger); }
.camError .camDot { background-color: var(--danger); box-shadow: 0 0 6px var(--danger); }

/* Responsive Adjustments */
@media (max-width: 1024px) {
  .cameraGrid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  .card { flex-direction: column; }
  .header { width: 100%; margin-bottom: 16px; }
}
```

---

## 📊 3. Status Log Section (`StatusLogSection`)

### React Structure
*   **Header:** Title with `<ClockCounterClockwise />` icon, subtitle, and refresh metadata.
*   **Table:** A standard HTML `<table>` wrapped in a responsive `div`.
*   **StatusLight Component:** A custom micro-component that renders a pulsing dot with an absolute-positioned CSS tooltip on hover.

### Exact CSS (`StatusLogSection.module.css`)
```css
.section {
  background-color: var(--bg-surface);
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
  padding: 24px;
  border: 1px solid var(--border-color);
  margin-top: 24px;
}

/* Header Styles */
.sectionHeader {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--text-main);
}
.title svg { color: var(--primary); }

.subtitle {
  font-size: 13px;
  color: var(--text-muted);
}

.refreshMeta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 12px;
  color: var(--text-muted);
  text-align: right;
}
.refreshMeta span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  justify-content: flex-end;
}
.refreshMeta strong {
  color: var(--text-main);
  font-weight: 600;
}

/* Table Styles */
.tableResponsive { overflow-x: auto; }

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th, .table td {
  padding: 14px 16px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.table th {
  font-weight: 500;
  color: var(--text-muted);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.table td { font-size: 14px; }
.centerCol { text-align: center !important; }

.timestampCol {
  display: flex;
  flex-direction: column;
  gap: 2px;
  white-space: nowrap;
}

/* Status Light & Tooltip Micro-interactions */
.statusLightContainer {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative; /* Needed for tooltip positioning */
}

.statusLight {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid transparent;
}

.lightUp {
  background-color: var(--accent);
  border-color: rgba(40, 167, 69, 0.4);
  box-shadow: 0 0 8px var(--accent);
}

.lightDown {
  background-color: var(--danger);
  border-color: rgba(220, 53, 69, 0.4);
  box-shadow: 0 0 8px var(--danger);
  animation: pulse-error 2s infinite;
  cursor: help;
}

/* Custom CSS Tooltip */
.tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 8px;
  padding: 6px 10px;
  background-color: #333;
  color: #fff;
  font-size: 11px;
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s, visibility 0.2s;
  z-index: 10;
  pointer-events: none;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 4px;
  border-style: solid;
  border-color: #333 transparent transparent transparent;
}

.statusLightContainer:hover .tooltip {
  opacity: 1;
  visibility: visible;
}

@keyframes pulse-error {
  0% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.4); }
  70% { box-shadow: 0 0 0 8px rgba(220, 53, 69, 0); }
  100% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0); }
}

.noData td {
  text-align: center;
  padding: 40px;
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .refreshMeta { text-align: left; }
  .refreshMeta span { justify-content: flex-start; }
}
```

---

## 📦 4. Data Models (TypeScript Interfaces)

To power the UI above, the following exact TypeScript interfaces are required:

```typescript
export type HealthStatus = 'ok' | 'warning' | 'error';

export interface SystemComponentStatus {
  id: string;
  name: string;
  icon: string;           // String mapping to Phosphor Icons (e.g., 'camera', 'database')
  status: HealthStatus;
  detail?: string;
  sidebarDetail: string;
  indicator: string;      // Usually 'Online' or 'Offline'
  details: string[];      // Array of strings (e.g., ["IP: 192.168.1.50", "Firmware: v2.1"])
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
  offlineCameras?: string[]; // Used to populate the hover tooltip (e.g., ["Cam 2", "Cam 4"])
  offlineSensors?: string[]; // Used to populate the hover tooltip
}
```