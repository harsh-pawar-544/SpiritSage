// src/App.tsx

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

// --- NEW IMPORTS FOR NEW PAGES ---
import AlcoholTypeDetailPage from './pages/AlcoholType/[id]';
import SubtypeDetailPage from './pages/Subtype/[id]';

// --- ADD THIS MISSING IMPORT ---
import SpiritProfilePage from './pages/Spirit/[id]'; // Assuming your individual spirit page is here

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
                {/* Main Explore/Home Page - Link to AlcoholType details from here */}
                <Route path="/" element={<SpiritListPage />} />
                <Route path="/explore" element={<SpiritListPage />} />

                {/* NEW ROUTES FOR ALCOHOL TYPE AND SUBTYPE DETAILS */}
                <Route path="/alcohol-type/:id" element={<AlcoholTypeDetailPage />} />
                <Route path="/subtype/:id" element={<SubtypeDetailPage />} />

                {/* Route for individual Brand/Spirit Profile Page (now correctly imported) */}
                <Route path="/spirit/:id" element={<SpiritProfilePage />} />

                {/* Original routes, review if still needed */}
                <Route path="/category/:id" element={<SpiritOverviewPage />} />
                <Route path="/category/:id/subtypes" element={<SpiritSubtypesPage />} />

                {/* Other static pages */}
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