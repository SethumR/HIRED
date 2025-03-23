import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, Typography, CircularProgress, Alert, Paper, Chip, Stack } from '@mui/material';

const GenerateScript = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scriptData, setScriptData] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.type;
      console.log('Selected file type:', fileType);
      if (fileType === 'application/pdf' || 
          fileType === 'application/msword' || 
          fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Please upload a PDF or Word document');
        setFile(null);
      }
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log('Sending request to generate script...');
      console.log('File being sent:', file.name, file.type);
      
      const response = await axios.post('http://localhost:8000/generate-script', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
        validateStatus: function (status) {
          return status < 500; // Resolve only if the status code is less than 500
        }
      });

      console.log('Response status:', response.status);
      console.log('Response data:', response.data);

      if (response.status === 200) {
        setScriptData(response.data);
      } else {
        throw new Error(response.data.detail || 'Failed to generate script');
      }
    } catch (err) {
      console.error('Error details:', err);
      const errorMessage = err.response?.data?.detail || err.message || 'Error generating script';
      console.error('Error message:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto', bgcolor: '#fff' }}>
      <Typography variant="h4" gutterBottom>
        Generate Introduction Script
      </Typography>
      
      <Box sx={{ my: 3 }}>
        <input
          accept=".pdf,.doc,.docx"
          style={{ display: 'none' }}
          id="cv-file"
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="cv-file">
          <Button variant="contained" component="span">
            Upload CV
          </Button>
        </label>
        {file && (
          <Typography sx={{ mt: 1 }}>
            Selected file: {file.name}
          </Typography>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={!file || loading}
        sx={{ mt: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Generate Script'}
      </Button>

      {scriptData && (
        <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* CV Analysis Section */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              CV Analysis
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Current Role
                </Typography>
                <Typography>{scriptData.cv_analysis.job_role}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Experience
                </Typography>
                <Typography>{scriptData.cv_analysis.experience}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Skills
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {scriptData.cv_analysis.skills.map((skill, index) => (
                    <Chip key={index} label={skill} size="small" />
                  ))}
                </Stack>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Education
                </Typography>
                <Typography>{scriptData.cv_analysis.education}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Certifications
                </Typography>
                <ul style={{ margin: 0 }}>
                  {scriptData.cv_analysis.certifications.map((cert, index) => (
                    <li key={index}>{cert}</li>
                  ))}
                </ul>
              </Box>
            </Stack>
          </Paper>

          {/* Introduction Script Section */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Your Introduction Script
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              Estimated Duration: {scriptData.duration_estimate}
            </Typography>
            <Typography sx={{ whiteSpace: 'pre-line', mb: 3 }}>
              {scriptData.introduction_script}
            </Typography>

            <Typography variant="h6" gutterBottom>
              Key Points to Remember
            </Typography>
            <ul>
              {scriptData.key_points.map((point, index) => (
                <li key={index}>
                  <Typography>{point}</Typography>
                </li>
              ))}
            </ul>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default GenerateScript; 