import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import SpiritPage from './pages/SpiritPage';
import { SpiritsProvider } from './contexts/SpiritsContext';

function App() {
  return (
    <SpiritsProvider>
      <Router>
        <Toaster position="top-center" />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:id" element={<CategoryPage />} />
            <Route path="/spirit/:id" element={<SpiritPage />} />
          </Routes>
        </Layout>
      </Router>
    </SpiritsProvider>
  );
}

export default App;