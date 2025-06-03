// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SpiritsProvider } from './contexts/SpiritsContext'; // Import SpiritsProvider
import { UserPreferencesProvider } from './contexts/UserPreferencesContext';
import { RecommendationsProvider } from './contexts/RecommendationsContext'; // Import RecommendationsProvider
import Layout from './components/Layout';
import Home from './pages/Home';
import SpiritListPage from './pages/SpiritList/SpiritListPage';
import SpiritOverviewPage from './pages/SpiritOverview/SpiritOverviewPage';
import SpiritSubtypesPage from './pages/SpiritSubtypes/SpiritSubtypesPage';
import SpiritProfilePage from './pages/Spirit/[id]';
import AboutPage from './pages/pages/About/AboutPage'; // Check path later if needed
import ContactPage from './pages/pages/Contact/ContactPage'; // Check path later if needed
import SettingsPage from './pages/pages/Settings/SettingsPage'; // Check path later if needed

function App() {
  return (
    // UserPreferencesProvider is the outermost, assuming it doesn't depend on Spirits or Recommendations
    <UserPreferencesProvider>
      {/* SpiritsProvider must wrap RecommendationsProvider because RecommendationsProvider uses useSpirits() */}
      <SpiritsProvider>
        <RecommendationsProvider>
          <Router>
            <Toaster position="top-center" />
            <Layout>
              <Routes>
                <Route path="/" element={<SpiritListPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/category/:id" element={<SpiritOverviewPage />} />
                <Route path="/category/:id/subtypes" element={<SpiritSubtypesPage />} />
                <Route path="/spirit/:id" element={<SpiritProfilePage />} />
              </Routes>
            </Layout>
          </Router>
        </RecommendationsProvider>
      </SpiritsProvider>
    </UserPreferencesProvider>
  );
}

export default App;