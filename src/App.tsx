// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
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

// NEW IMPORT (make sure this path is correct based on your file structure)
import OtherAlcoholPage from './pages/OtherAlcoholPage';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <SpiritsProvider> {/* SpiritsContext is still used */}
          <RecommendationsProvider>
            <div className="flex flex-col min-h-screen dark:bg-gray-900">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<HomePage />} />
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
              <Footer />
            </div>
          </RecommendationsProvider>
        </SpiritsProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;