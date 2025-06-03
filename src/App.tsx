// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SpiritsProvider } from './contexts/SpiritsContext';
import { UserPreferencesProvider } from './contexts/UserPreferencesContext';
import { RecommendationsProvider } from './contexts/RecommendationsContext';
import Layout from './components/Layout';
import Home from './pages/Home'; // Assuming Home is your main Explore page
import SpiritListPage from './pages/SpiritList/SpiritListPage'; // This might be your old Explore page
import SpiritOverviewPage from './pages/SpiritOverview/SpiritOverviewPage'; // This might be for category overview
import SpiritSubtypesPage from './pages/SpiritSubtypes/SpiritSubtypesPage'; // This might be for listing subtypes

// --- NEW IMPORTS FOR NEW PAGES ---
import AlcoholTypeDetailPage from './pages/AlcoholType/[id]'; // New AlcoholType detail page
import SubtypeDetailPage from './pages/Subtype/[id]';       // New Subtype detail page

import AboutPage from './pages/About/AboutPage';
import ContactPage from './pages/Contact/ContactPage';
import SettingsPage from './pages/Settings/SettingsPage';


function App() {
  return (
    <UserPreferencesProvider>
      <SpiritsProvider> {/* SpiritsProvider must wrap RecommendationsProvider */}
        <RecommendationsProvider>
          <Router>
            <Toaster position="top-center" />
            <Layout>
              <Routes>
                {/* Main Explore/Home Page - Link to AlcoholType details from here */}
                <Route path="/" element={<SpiritListPage />} />
                <Route path="/explore" element={<SpiritListPage />} /> {/* You might use /explore as main */}

                {/* NEW ROUTES FOR ALCOHOL TYPE AND SUBTYPE DETAILS */}
                {/* Route for AlcoholType Detail Page */}
                <Route path="/alcohol-type/:id" element={<AlcoholTypeDetailPage />} />
                {/* Route for Subtype Detail Page - lists brands for this subtype */}
                <Route path="/subtype/:id" element={<SubtypeDetailPage />} />

                {/* Route for individual Brand/Spirit Profile Page (already existing) */}
                <Route path="/spirit/:id" element={<SpiritProfilePage />} />

                {/* Original routes, ensure these are still needed or replaced */}
                {/* You might want to rename SpiritOverviewPage or SpiritSubtypesPage if they are redundant */}
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