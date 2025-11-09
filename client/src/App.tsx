import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RootLayout } from './components/layouts/RootLayout';
import PopupContent from '../extension/popup/PopupContent';
import Landing from './pages/Landing';
import Help from './pages/Help';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Landing />} />
          <Route path="dashboard" element={<Help/>} />
          <Route path="history" element={<div>History</div>} />
          <Route path="settings" element={<div>Settings</div>} />
          <Route path="popup" element={<PopupContent />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}