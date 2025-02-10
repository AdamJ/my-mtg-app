// src/components/PageTemplate.jsx (or src/PageTemplate.jsx)
import React from 'react';
import { Container, Typography, Box } from '@mui/material';

function PageTemplate({ title, children }) {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}> {/* Container for consistent spacing */}
      <Typography variant="h4" gutterBottom component="h1"> {/* Main title */}
        {title}
      </Typography>
      <Box> {/* Box for content */}
          {children} {/* Content goes here */}
      </Box>
    </Container>
  );
}

export default PageTemplate;
