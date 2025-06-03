import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Home from './pages/Home';
import SpiritOverviewPage from './pages/SpiritOverview/SpiritOverviewPage';
import SpiritPage from './pages/SpiritPage';
import { SpiritsProvider } from './contexts/SpiritsContext';
import { UserPreferencesProvider } from './contexts/UserPreferencesContext';
import { RecommendationsProvider } from './contexts/RecommendationsContext';

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
                <Route path="/category/:id" element={<SpiritOverviewPage />} />
                <Route path="/spirit/:id" element={<SpiritPage />} />
              </Routes>
            </Layout>
          </Router>
        </RecommendationsProvider>
      </SpiritsProvider>
    </UserPreferencesProvider>
  );
}

export default App;