import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Predict from './pages/Predict';
import History from './pages/History';
import About from './pages/About';
import Contact from './pages/Contact';
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: '#1976D2' },
      secondary: { main: '#FF6F61' },
      background: { default: darkMode ? '#1A1A1A' : '#F5F7FA' },
    },
    typography: {
      fontFamily: '"Roboto", sans-serif',
      h1: { fontFamily: '"Poppins", sans-serif' },
      h2: { fontFamily: '"Poppins", sans-serif' },
      h3: { fontFamily: '"Poppins", sans-serif' },
    },
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/predict" element={<Predict />} />
            <Route path="/history" element={<History />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </AnimatePresence>
      </Router>
    </ThemeProvider>
  );
};

export default App;