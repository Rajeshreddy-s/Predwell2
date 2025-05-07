import React from 'react';
import { AppBar, Toolbar, Typography, Button, Switch, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Apply motion to the Link component directly
const MotionLink = motion(Link);

const Navbar = ({ toggleDarkMode, darkMode }) => {
  const buttonVariants = {
    hover: { scale: 1.1, color: '#FF6F61', transition: { duration: 0.3 } },
    tap: { scale: 0.95 },
  };

  return (
    <AppBar position="static" sx={{ bgcolor: darkMode ? '#1A1A1A' : '#1976D2', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div" sx={{ fontFamily: '"Poppins", sans-serif', fontWeight: 700 }}>
          PredictWell
        </Typography>
        <Box>
          {['Home', 'Predict', 'History', 'About', 'Contact'].map((text) => (
            <Button
              key={text}
              color="inherit"
              component={MotionLink} // Use the motion-wrapped Link
              to={text === 'Home' ? '/' : `/${text.toLowerCase()}`}
              sx={{ mx: 1, fontFamily: '"Roboto", sans-serif' }}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              {text}
            </Button>
          ))}
          <Switch checked={darkMode} onChange={toggleDarkMode} color="secondary" />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;