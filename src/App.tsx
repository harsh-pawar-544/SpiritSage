// Inside src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { SpiritsProvider } from './contexts/SpiritsContext';
import { UserPreferencesProvider } from './contexts/UserPreferencesContext';
import { RecommendationsProvider } from './contexts/RecommendationsContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import SpiritListPage from './pages/SpiritList/SpiritListPage';
import MyBarPage from './pages/MyBar/MyBarPage';
import SpiritOverviewPage from './pages/SpiritOverview/SpiritOverviewPage';
import SpiritSubtypesPage from './pages/SpiritSubtypes/SpiritSubtypesPage';
import BrandsPage from './pages/BrandsPage';

import AlcoholTypeDetailPage from './pages/AlcoholType/[id]';
import SubtypeDetailPage from './pages/Subtype/[id]';

import SpiritProfilePage from './pages/Spirit/[id]';

import AboutPage from './pages/About/AboutPage';
import ContactPage from './pages/Contact/ContactPage';
import SettingsPage from './pages/Settings/SettingsPage'; // <-- Make sure this import is here

function App() {
  return (
    <UserPreferencesProvider>
      <AuthProvider>
        <SpiritsProvider>
          <RecommendationsProvider>
            <Router>
              <Toaster position="top-center" />
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/explore" element={<SpiritListPage />} />
                  <Route path="/my-bar" element={<MyBarPage />} />
                  <Route path="/alcohol-type/:id" element={<AlcoholTypeDetailPage />} />
                  <Route path="/alcohol-type/:id/subtypes" element={<SpiritSubtypesPage />} />
                  <Route path="/subtype/:id" element={<SubtypeDetailPage />} />

                  <Route path="/spirit/:id" element={<SpiritProfilePage />} />

                  <Route path="/category/:id" element={<SpiritOverviewPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/settings" element={<SettingsPage />} /> {/* <--- THE FIX IS HERE! */}
                </Routes>
              </Layout>
            </Router>
          </RecommendationsProvider>
        </SpiritsProvider>
      </AuthProvider>
    </UserPreferencesProvider>
  );
}

export default App;