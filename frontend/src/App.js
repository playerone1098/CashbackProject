import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Deals } from './pages/Deals';
import { DealDetail } from './pages/DealDetail';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { FAQ } from './pages/FAQ';

function App() {
  const location = useLocation();

  useEffect(() => {
    const recordPageView = async () => {
      try {
        await axios.post('/api/analytics/page-view', {
          path: location.pathname + location.search
        });
      } catch (err) {
        console.error('Failed to log page view:', err);
      }
    };
    recordPageView();
  }, [location.pathname, location.search]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/deals/:id" element={<DealDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
