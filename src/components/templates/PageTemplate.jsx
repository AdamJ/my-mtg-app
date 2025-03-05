// src/components/PageTemplate.jsx (or src/PageTemplate.jsx)
import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import PropTypes from 'prop-types'; // Import prop-types

function PageTemplate({ title, children }) {
  return (
    <Container sx={{ mt: 4, mb: 6 }}> {/* Container for consistent spacing */}
      <Typography variant="h4" gutterBottom component="h1"> {/* Main title */}
        {title}
      </Typography>
      <Box> {/* Box for content */}
        {children} {/* Content goes here */}
      </Box>
    </Container>
  );
};

// Define the prop types:
PageTemplate.propTypes = {
  title: PropTypes.string.isRequired, // title is a required string
  children: PropTypes.node.isRequired, // children can be any renderable node (elements, strings, numbers, etc.)
};

export default PageTemplate;
