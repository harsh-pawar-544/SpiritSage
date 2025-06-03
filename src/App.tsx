import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SpiritsProvider } from './contexts/SpiritsContext';
import { UserPreferencesProvider } from './contexts/UserPreferencesContext';
import { RecommendationsProvider } from './contexts/RecommendationsContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import SpiritListPage from './pages/SpiritList/SpiritListPage';
import SpiritOverviewPage from './pages/SpiritOverview/SpiritOverviewPage';
import SpiritSubtypesPage from './pages/SpiritSubtypes/SpiritSubtypesPage';

import AlcoholTypeDetailPage from './pages/AlcoholType/[id]';
import SubtypeDetailPage from './pages/Subtype/[id]';
import SpiritProfilePage from './pages/Spirit/[id]';

import AboutPage from './pages/About/AboutPage';
import ContactPage from './pages/Contact/ContactPage';
import SettingsPage from './pages/Settings/SettingsPage';

function App() {
  return (
    <UserPreferencesProvider>
      <SpiritsProvider>
        <RecommendationsProvider>
          <Router>
            <Toaster position="top-center" />
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<SpiritListPage />} />
                <Route path="/alcohol-type/:id" element={<AlcoholTypeDetailPage />} />
                <Route path="/alcohol-type/:id/subtypes" element={<SpiritSubtypesPage />} />
                <Route path="/subtype/:id" element={<SubtypeDetailPage />} />
                <Route path="/spirit/:id" element={<SpiritProfilePage />} />
                <Route path="/category/:id" element={<SpiritOverviewPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </Layout>
          </Router>
        </RecommendationsProvider>
      </SpiritsProvider>
    </UserPreferencesProvider>
  );
}

export default App;