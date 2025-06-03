import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SpiritsProvider } from './contexts/SpiritsContext';
import { UserPreferencesProvider } from './contexts/UserPreferencesContext';
import Layout from './components/Layout';
import SpiritListPage from './pages/SpiritList/SpiritListPage';
import SpiritOverviewPage from './pages/SpiritOverview/SpiritOverviewPage';
import SpiritSubtypesPage from './pages/SpiritSubtypes/SpiritSubtypesPage';
import SpiritProfilePage from './pages/Spirit/[id]';

function App() {
  return (
    <UserPreferencesProvider>
      <SpiritsProvider>
        <Router>
          <Toaster position="top-center" />
          <Layout>
            <Routes>
              <Route path="/" element={<SpiritListPage />} />
              <Route path="/category/:id" element={<SpiritOverviewPage />} />
              <Route path="/category/:id/subtypes" element={<SpiritSubtypesPage />} />
              <Route path="/spirit/:id" element={<SpiritProfilePage />} />
            </Routes>
          </Layout>
        </Router>
      </SpiritsProvider>
    </UserPreferencesProvider>
  );
}

export default App;