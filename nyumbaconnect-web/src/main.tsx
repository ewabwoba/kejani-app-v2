import React from 'react';
import ReactDOM from 'react-dom/client';
import { AdminDashboardScreen } from './presentation/screens/Admin/AdminDashboardScreen';

// regionId comes from the logged-in moderator's assignment in a real login
// flow (not built yet — see README). Hardcoded here only as the local-dev
// default so `npm run dev` has something to render immediately.
const DEFAULT_REGION_ID = 'nairobi';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AdminDashboardScreen regionId={DEFAULT_REGION_ID} regionLabel="the Nairobi region" />
  </React.StrictMode>,
);
