import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { PieChart, Pie, Tooltip, Legend, Cell } from 'recharts';
import { motion } from 'framer-motion';

const About = () => {
  const data = [
    { name: 'Correct Predictions', value: 85, fill: '#1976D2' },
    { name: 'Incorrect Predictions', value: 15, fill: '#FF6F61' },
  ];

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 1 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container sx={{ mt: 5, py: 5, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom sx={{ color: '#1976D2', fontWeight: 700 }}>
          About PredictWell
        </Typography>
        <Typography variant="body1" paragraph sx={{ maxWidth: '800px', mx: 'auto' }}>
          PredictWell is designed to empower individuals to assess their diabetes risk using advanced AI technology. Our tool leverages machine learning to provide accurate predictions based on key health metrics.
        </Typography>
        <Typography variant="body1" paragraph sx={{ maxWidth: '800px', mx: 'auto' }}>
          The model, built with a Random Forest algorithm, achieves an accuracy of approximately 85% on the Pima Indians Diabetes Dataset, ensuring reliable insights for users.
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ mt: 5, fontWeight: 600 }}>
          Model Performance
        </Typography>
        <motion.div variants={chartVariants} initial="hidden" animate="visible">
          <PieChart width={400} height={300}>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </motion.div>
      </Container>
    </motion.div>
  );
};

export default About;