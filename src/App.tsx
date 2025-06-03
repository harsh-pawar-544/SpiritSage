import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Home from './pages/Home';
import SpiritOverviewPage from './pages/SpiritOverview/SpiritOverviewPage';
import SpiritProfilePage from './pages/Spirit/[id]';
import { SpiritsProvider } from './contexts/SpiritsContext';
import { SpiritSageProvider } from './contexts/SpiritSageContext';
import { RecommendationsProvider } from './contexts/RecommendationsContext';

function App() {
  return (
    <SpiritSageProvider>
      <SpiritsProvider>
        <RecommendationsProvider>
          <Router>
            <Toaster position="top-center" />
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/category/:id" element={<SpiritOverviewPage />} />
                <Route path="/spirit/:id" element={<SpiritProfilePage />} />
              </Routes>
            </Layout>
          </Router>
        </RecommendationsProvider>
      </SpiritsProvider>
    </SpiritSageProvider>
  );
}

export default App;