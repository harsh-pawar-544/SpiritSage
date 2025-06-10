// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// CORRECTED: Import 'Home' component from 'home.tsx' directly in src/
import Home from './home'; 

import ExplorePage from './pages/ExplorePage';
import SpiritProfilePage from './pages/Spirit/[id]'; // Your spirit detail page
import SpiritOverviewPage from './pages/AlcoholType/[id]'; // Alcohol type detail page
import SubtypeDetailPage from './pages/Subtype/[id]'; // Subtype detail page
import MyBarPage from './pages/MyBarPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import SettingsPage from './pages/SettingsPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import { AuthProvider } from './contexts/AuthContext';
import { SpiritsProvider } from './contexts/SpiritsContext';
import { RecommendationsProvider } from './contexts/RecommendationsContext';

import OtherAlcoholPage from './pages/OtherAlcoholPage';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <SpiritsProvider>
          <RecommendationsProvider>
            <div className="flex flex-col min-h-screen dark:bg-gray-900">
              <main className="flex-grow">
                <Routes>
                  {/* CORRECTED: Use 'Home' component for the root path */}
                  <Route path="/" element={<Home />} /> 
                  
                  <Route path="/explore" element={<ExplorePage />} />
                  <Route path="/my-bar" element={<MyBarPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/signin" element={<SignInPage />} />
                  <Route path="/signup" element={<SignUpPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />

                  {/* Spirit/Alcohol Detail Routes */}
                  <Route path="/spirit/:id" element={<SpiritProfilePage />} />
                  <Route path="/alcohol-type/:id" element={<SpiritOverviewPage />} />
                  <Route path="/subtype/:id" element={<SubtypeDetailPage />} />

                  {/* NEW ROUTE for Other Alcohol */}
                  <Route path="/other-alcohol" element={<OtherAlcoholPage />} />
                </Routes>
              </main>
            </div>
          </RecommendationsProvider>
        </SpiritsProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;