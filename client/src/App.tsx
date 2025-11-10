import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RootLayout } from './components/layouts/RootLayout';
import DashboardLayout from './components/layouts/DashboardLayout';
import PopupContent from '../extension/popup/PopupContent';
import Landing from './pages/Landing';
import SettingsPage from './components/ui/dashboard/settings/page';
import SubscriptionPage from './components/ui/dashboard/subscription/page';
import ThreatReportPage from './components/ui/dashboard/threat-report/page';
import HelpSupportPage from './components/ui/dashboard/help-support/page';
import AccountPage from './components/ui/dashboard/account/page';
import IndustryMoodPage from './components/ui/dashboard/industry-mood/page';
import InboxScanPage from './components/ui/dashboard/inbox-scan/page';
import DocsPage from './pages/Docs';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Landing />} />
          <Route path="popup" element={<PopupContent />} />
          <Route path="docs" element={<DocsPage />} />
        </Route>

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="inbox-scan"  element={<InboxScanPage />} />
          <Route path="history" element={<div>History</div>} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="subscription" element={<SubscriptionPage />} />
          <Route path="threat-report" element={<ThreatReportPage />} />
          <Route path="help-support" element={<HelpSupportPage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="industry-mood" element={<IndustryMoodPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
