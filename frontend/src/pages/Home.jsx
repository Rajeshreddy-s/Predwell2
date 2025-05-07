import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Apply motion to the Link component directly
const MotionLink = motion(Link);

const Home = () => {
  const textVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const buttonVariants = {
    hover: { scale: 1.1, backgroundColor: '#FF6F61', transition: { duration: 0.3 } },
    tap: { scale: 0.95 },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 1, delay: 0.5 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container sx={{ textAlign: 'center', mt: 10, py: 8 }}>
        <motion.div variants={textVariants} initial="hidden" animate="visible">
          <Typography
            variant="h2"
            gutterBottom
            sx={{ color: '#1976D2', fontWeight: 700, fontFamily: '"Poppins", sans-serif' }}
          >
            Predict Diabetes Risk in Seconds
          </Typography>
          <Typography
            variant="h5"
            color="textSecondary"
            paragraph
            sx={{ maxWidth: '600px', mx: 'auto', fontFamily: '"Roboto", sans-serif' }}
          >
            Leverage our AI-powered tool to assess your diabetes risk with ease, accuracy, and speed.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={MotionLink} // Use the motion-wrapped Link
            to="/predict"
            sx={{ mt: 3, px: 4, py: 1.5, fontSize: '1.1rem' }}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Get Started
          </Button>
        </motion.div>
        <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
          <motion.img
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&h=300&q=80"
            alt="Diabetes Prediction Visual"
            style={{
              maxWidth: '100%',
              height: 'auto',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              objectFit: 'cover',
            }}
            variants={imageVariants}
            initial="hidden"
            animate="visible"
          />
        </Box>
      </Container>
    </motion.div>
  );
};

export default Home;