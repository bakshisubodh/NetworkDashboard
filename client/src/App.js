import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Overview from './pages/Overview';
import Quality from './pages/Quality';
import Health from './pages/Health';
import ReleaseReadiness from './pages/ReleaseReadiness';
import ServiceDetail from './pages/ServiceDetail';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/quality" element={<Quality />} />
              <Route path="/health" element={<Health />} />
              <Route path="/release-readiness" element={<ReleaseReadiness />} />
              <Route path="/service/:id" element={<ServiceDetail />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App; 