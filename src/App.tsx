import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SpiritsProvider } from './contexts/SpiritsContext';
import { SpiritSageProvider } from './contexts/SpiritSageContext';
import { UserPreferencesProvider } from './contexts/UserPreferencesContext';
import { RecommendationsProvider } from './contexts/RecommendationsContext';
import { UserProfileProvider } from './contexts/UserProfileContext';
import Layout from './components/layout/Layout';
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
    <UserProfileProvider>
      <UserPreferencesProvider>
        <SpiritSageProvider>
          <SpiritsProvider>
            <RecommendationsProvider>
              <Router>
                <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
                <Layout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/explore" element={<SpiritListPage />} />
                    <Route path="/category/:id" element={<SpiritOverviewPage />} />
                    <Route path="/category/:id/subtypes" element={<SpiritSubtypesPage />} />
                    <Route path="/spirit/:id" element={<SpiritProfilePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                  </Routes>
                </Layout>
              </Router>
            </RecommendationsProvider>
          </SpiritsProvider>
        </SpiritSageProvider>
      </UserPreferencesProvider>
    </UserProfileProvider>
  );
}

export default App;