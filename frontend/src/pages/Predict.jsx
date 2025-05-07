import React, { useState } from 'react';
  import { Container, Typography, TextField, Button, Grid, Card, CardContent, CircularProgress, Alert, Box } from '@mui/material';
  import { motion } from 'framer-motion';
  import axios from 'axios';

  const Predict = () => {
    const [formData, setFormData] = useState({
      pregnancies: '',
      glucose: '',
      bloodPressure: '',
      skinThickness: '',
      insulin: '',
      bmi: '',
      diabetesPedigree: '',
      age: '',
    });
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [predictionId, setPredictionId] = useState(null);

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      setResult(null);
      try {
        const response = await axios.post('https://predictwell-backend.onrender.com/api/predict', formData, {
          timeout: 30000, // 30-second timeout to handle Render spin-up
        });
        setResult(response.data.result);
        setPredictionId(response.data.id);
      } catch (error) {
        console.error('Prediction error:', error);
        setError(error.response?.data?.error || 'Failed to get prediction. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const handleDownload = () => {
      if (predictionId) {
        window.location.href = `https://predictwell-backend.onrender.com/api/report/${predictionId}`;
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

    const cardVariants = {
      hidden: { opacity: 0, y: 50 },
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
        <Container sx={{ mt: 5, py: 5 }}>
          <Typography variant="h3" align="center" gutterBottom sx={{ color: '#1976D2', fontWeight: 700 }}>
            Predict Diabetes Risk
          </Typography>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            </motion.div>
          )}
          <Grid container spacing={3} component="form" onSubmit={handleSubmit} sx={{ maxWidth: '800px', mx: 'auto' }}>
            {Object.keys(formData).map((key, index) => (
              <Grid item xs={12} sm={6} key={key}>
                <motion.div
                  custom={index}
                  variants={fieldVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <TextField
                    fullWidth
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    variant="outlined"
                    type="number"
                    required
                    inputProps={{ step: key === 'diabetesPedigree' || key === 'bmi' ? '0.1' : '1' }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': { borderColor: '#1976D2' },
                      },
                    }}
                  />
                </motion.div>
              </Grid>
            ))}
            <Grid item xs={12} sx={{ textAlign: 'center', mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ px: 5, py: 1.5, fontSize: '1.1rem' }}
                component={motion.Button}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Predict'}
              </Button>
            </Grid>
          </Grid>
          {loading && (
            <Typography align="center" sx={{ mt: 3, color: '#1976D2' }}>
              Processing your prediction... Please wait.
            </Typography>
          )}
          {result && (
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              sx={{ maxWidth: '500px', mx: 'auto', mt: 5 }}
            >
              <Card sx={{ bgcolor: result === 'High Risk' ? '#FF6F61' : '#26A69A', color: '#fff' }}>
                <CardContent>
                  <Typography variant="h5" align="center">
                    Result: {result}
                  </Typography>
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Button
                      variant="contained"
                      sx={{ bgcolor: '#FF6F61', color: '#fff' }}
                      onClick={handleDownload}
                      disabled={!predictionId}
                      component={motion.Button}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      Download Report
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </Container>
      </motion.div>
    );
  };

  export default Predict;