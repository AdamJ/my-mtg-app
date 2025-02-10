import React, { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Container, Toolbar, Typography, Button, Box } from '@mui/material'; // Import Material UI components
import AppLifeCounter from './components/AppLifeCounter';
import CardListCreator from './components/CardListCreator';
import InformationPage from './components/InformationPage';
import InfoIcon from '@mui/icons-material/Info';
import { ThemeProvider, createTheme } from '@mui/material/styles';

function App() {

  const [mode, setMode] = useState(localStorage.getItem('mode') || 'light'); // Retrieve from localStorage

  useEffect(() => {
    localStorage.setItem('mode', mode); // Save to localStorage whenever mode changes
  }, [mode]);

  const theme = createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            // palette values for light mode
            primary: {
              main: '#1565C0',
            },
            secondary: {
              main: '#93A6AF',
            },
            error: {
              main: '#B71C1C',
            },
            warning: {
              main: '#FF6F00',
            },
            info: {
              main: '#0091EA',
            },
            success: {
              main: '#2E7D32',
            },
            divider: '#9e9e9e',
            background: {
              default: '#f1f1f1',
              paper: '#eeeeee',
            },
          }
        : {
            // palette values for dark mode
            primary: {
              main: '#0E4686',
            },
            secondary: {
              main: '#78909c',
            },
            error: {
              main: '#ff0004',
            },
            warning: {
              main: '#ffca28',
            },
            info: {
              main: '#00A0B2',
            },
            success: {
              main: '#00C853',
            },
            divider: '#9e9e9e',
            background: {
              default: '#060606',
              paper: '#0e0e0e',
            },
          }),
    },
  });

  const handleModeChange = (event) => {
    setMode(event.target.checked ? 'dark' : 'light');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normalize CSS */}
      <Router>
        <Container>
          <Box sx={{ flexGrow: 1 }}> {/* Use Box for layout */}
            <AppBar position="static"> {/* Use AppBar for navigation */}
              <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  MTG App
                </Typography>
                <Button color="inherit" component={Link} to="/my-mtg-app/life-counter">Life Counter</Button>
                <Button color="inherit" component={Link} to="/my-mtg-app/card-list">Deck List</Button>
                <Button color="inherit" component={Link} to="/my-mtg-app/info"><InfoIcon /></Button>
                <FormGroup>
                  <FormControlLabel
                    control={<Switch checked={mode === 'dark'} onChange={handleModeChange} />}
                    label={mode === 'dark' ? <i className="ms ms-dfc-night"></i> : <i className="ms ms-dfc-day"></i>}
                  />
                </FormGroup>
              </Toolbar>
            </AppBar>

            <Box sx={{ padding: 2 }}> {/* Add some padding around content */}
              <Routes>
                <Route path="/my-mtg-app/life-counter" element={<AppLifeCounter />} />
                <Route path="/my-mtg-app/card-list" element={<CardListCreator />} />
                <Route path="/my-mtg-app/info" element={<InformationPage />} />
              </Routes>
            </Box>
          </Box>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
