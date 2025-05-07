import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Alert, Box } from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/contact', formData);
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Contact error:', error);
    }
  };

  const fieldVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.5 },
    }),
  };

  const alertVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const buttonVariants = {
    hover: { scale: 1.1, backgroundColor: '#FF6F61', transition: { duration: 0.3 } },
    tap: { scale: 0.95 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container sx={{ mt: 5, py: 5, maxWidth: '600px' }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ color: '#1976D2', fontWeight: 700 }}>
          Contact Us
        </Typography>
        {success && (
          <motion.div
            variants={alertVariants}
            initial="hidden"
            animate="visible"
          >
            <Alert severity="success" sx={{ mb: 3 }}>
              Message sent successfully!
            </Alert>
          </motion.div>
        )}
        <Box component="form" onSubmit={handleSubmit}>
          {['name', 'email', 'message'].map((field, index) => (
            <motion.div
              key={field}
              custom={index}
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
            >
              <TextField
                fullWidth
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
                multiline={field === 'message'}
                rows={field === 'message' ? 4 : 1}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': { borderColor: '#1976D2' },
                  },
                }}
              />
            </motion.div>
          ))}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ px: 5, py: 1.5, fontSize: '1.1rem' }}
              component={motion.Button}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Send Message
            </Button>
          </Box>
        </Box>
      </Container>
    </motion.div>
  );
};

export default Contact;