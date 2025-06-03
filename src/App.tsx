import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SpiritsProvider } from './contexts/SpiritsContext';
import { UserPreferencesProvider } from './contexts/UserPreferencesContext';
import { RecommendationsProvider } from './contexts/RecommendationsContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import SpiritListPage from './pages/SpiritList/SpiritListPage';
import SpiritOverviewPage from './pages/SpiritOverview/SpiritOverviewPage';
import SpiritSubtypesPage from './pages/SpiritSubtypes/SpiritSubtypesPage';
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