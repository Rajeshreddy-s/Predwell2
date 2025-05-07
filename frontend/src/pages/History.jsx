import React, { useState, useEffect } from 'react';
import { Container, Typography, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { motion } from 'framer-motion';
import axios from 'axios';

const History = () => {
  const [predictions, setPredictions] = useState([]);

  const fetchHistory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/history');
      setPredictions(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/history/${id}`);
      setPredictions(predictions.filter((pred) => pred._id !== id));
    } catch (error) {
      console.error('Error deleting prediction:', error);
    }
  };

  const columns = [
    { field: 'timestamp', headerName: 'Date', width: 200, renderCell: (params) => new Date(params.value).toLocaleString() },
    { field: 'result', headerName: 'Result', width: 150 },
    { field: 'input', headerName: 'Inputs', width: 400, renderCell: (params) => JSON.stringify(params.value) },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <IconButton
          color="secondary"
          onClick={() => handleDelete(params.row._id)}
          component={motion.IconButton}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container sx={{ mt: 5, py: 5 }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ color: '#1976D2', fontWeight: 700 }}>
          Prediction History
        </Typography>
        <div style={{ height: 400, width: '100%', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <DataGrid
            rows={predictions}
            columns={columns}
            pageSize={5}
            getRowId={(row) => row._id}
            disableSelectionOnClick
            sx={{
              '& .MuiDataGrid-columnHeaders': { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
              '& .MuiDataGrid-cell': { fontFamily: '"Roboto", sans-serif' },
            }}
          />
        </div>
      </Container>
    </motion.div>
  );
};

export default History;