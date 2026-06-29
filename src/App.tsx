import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import ScanningStationsPage from '@/pages/ScanningStations/ScanningStationsPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/scanning-stations" replace />} />
        <Route path="scanning-stations" element={<ScanningStationsPage />} />
      </Route>
    </Routes>
  );
}
