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

import AlcoholTypeDetailPage from './pages/AlcoholType/[id]';
import SubtypeDetailPage from './pages/Subtype/[id]';
import SpiritProfilePage from './pages/Spirit/[id]'; // Ensure this is imported

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
                {/* Main Explore/Home Page */}
                <Route path="/" element={<SpiritListPage />} />
                <Route path="/explore" element={<SpiritListPage />} />

                {/* Alcohol Type Detail Page */}
                <Route path="/alcohol-type/:id" element={<AlcoholTypeDetailPage />} />

                {/* NEW ROUTE: For listing subtypes of a specific AlcoholType */}
                {/* This matches the link from AlcoholTypeDetailPage */}
                <Route path="/alcohol-type/:id/subtypes" element={<SpiritSubtypesPage />} />

                {/* Subtype Detail Page */}
                <Route path="/subtype/:id" element={<SubtypeDetailPage />} />

                {/* Individual Brand/Spirit Profile Page */}
                <Route path="/spirit/:id" element={<SpiritProfilePage />} />

                {/* Original routes - you might want to remove these or adjust if redundant */}
                {/* If SpiritOverviewPage or SpiritSubtypesPage are no longer needed under /category, consider removing them */}
                <Route path="/category/:id" element={<SpiritOverviewPage />} />
                {/* The route below is now replaced by /alcohol-type/:id/subtypes but kept for reference */}
                {/* <Route path="/category/:id/subtypes" element={<SpiritSubtypesPage />} /> */}


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