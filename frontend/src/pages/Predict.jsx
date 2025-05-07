import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Grid, Card, CardContent, CircularProgress, Alert, Box } from '@mui/material';
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

  const validateFormData = () => {
    for (const [key, value] of Object.entries(formData)) {
      if (value === '' || isNaN(value) || value === null) {
        return `Please enter a valid number for ${key.charAt(0).toUpperCase() + key.slice(1)}.`;
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    // Validate form data before sending
    const validationError = validateFormData();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    console.log('Submitting prediction request with data:', formData);
    try {
      const response = await axios.post('https://predictwell-backend.onrender.com/api/predict', formData, {
        timeout: 45000,
      });
      console.log('Prediction response:', response.data);
      setResult(response.data.result);
      setPredictionId(response.data.id);
    } catch (error) {
      console.error('Prediction error:', error);
      if (error.code === 'ECONNABORTED') {
        setError('Request timed out. The server might be starting up. Please try again in a few seconds.');
      } else if (error.response) {
        console.log('Error response from server:', error.response.data);
        setError(error.response.data.error || 'Failed to get prediction. Please try again later.');
      } else {
        setError('Network error. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (predictionId) {
      console.log('Downloading report for prediction ID:', predictionId);
      window.location.href = `https://predictwell-backend.onrender.com/api/report/${predictionId}`;
    }
  };

  return (
    <Container sx={{ mt: 5, py: 5 }}>
      <Typography variant="h3" align="center" gutterBottom sx={{ color: '#1976D2', fontWeight: 700 }}>
        Predict Diabetes Risk
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      <Grid container spacing={3} component="form" onSubmit={handleSubmit} sx={{ maxWidth: '800px', mx: 'auto' }}>
        {Object.keys(formData).map((key) => (
          <Grid item xs={12} sm={6} key={key}>
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
          </Grid>
        ))}
        <Grid item xs={12} sx={{ textAlign: 'center', mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ px: 5, py: 1.5, fontSize: '1.1rem' }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Predict'}
          </Button>
        </Grid>
      </Grid>
      {loading && (
        <Typography align="center" sx={{ mt: 3, color: '#1976D2' }}>
          Processing your prediction... This may take a few seconds if the server is starting up.
        </Typography>
      )}
      {result && (
        <Card sx={{ maxWidth: '500px', mx: 'auto', mt: 5, bgcolor: result === 'High Risk' ? '#FF6F61' : '#26A69A', color: '#fff' }}>
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
              >
                Download Report
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default Predict;