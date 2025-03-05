import React, { useState, useEffect, useRef } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AppBar, BottomNavigation, BottomNavigationAction, Paper, Container, Toolbar, Typography, Box, Slide } from '@mui/material'; // Import Material UI components
import Dashboard from './components/Dashboard';
import AppLifeCounter from './components/AppLifeCounter';
import CardListCreator from './components/CardListCreator';
import InformationPage from './components/InformationPage';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Icon from '@mui/material/Icon';

function App() {

  const [mode, setMode] = useState(localStorage.getItem('mode') || 'light'); // Retrieve from localStorage
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    localStorage.setItem('mode', mode); // Save to localStorage whenever mode changes
  }, [mode]);

  const theme = createTheme({
    typography: {
      fontFamily: [
        '"Liter"',
        'Roboto',
        'sans-serif',
      ].join(','),
      fontSize: 16,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: `
          @font-face {
            font-family: 'Liter';
            font-style: normal;
            font-display: swap;
            font-weight: 400;
          }
        `,
      },
      MuiChip: {
        styleOverrides: {
          root: {
            variants: [
              {
                // larger chip for life counter
                props: { size: 'large' },
                style: {
                  height: 80,
                  fontSize: 36,
                  fontWeight: 700,
                  boxShadow: '0px -0.5px 2px 0px rgba(255, 255, 255, 0.30) inset, 0px -0.5px 2px 0px rgba(255, 255, 255, 0.25) inset, 0px 1.5px 8px 0px rgba(0, 0, 0, 0.08) inset, 0px 1.5px 8px 0px rgba(0, 0, 0, 0.10) inset',
                }
              }
            ],
            borderRadius: 16,
          },
        },
      }
    },
    overrides: {
      MuiAppBar: {
        colorInherit: {
          backgroundColor: '#689f38',
          color: '#fff',
        },
      },
    },
    shape: {
      borderRadius: 16,
    },
    props: {
      MuiAppBar: {
        color: 'transparent',
      },
      MuiList: {
        dense: true,
      },
      MuiMenuItem: {
        dense: true,
      },
      MuiTable: {
        size: 'small',
      },
    },
    palette: {
      contrastThreshold: 4.5,
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
              main: '#FFC107',
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
              main: '#B71C1C',
            },
            warning: {
              main: '#ffca28',
            },
            info: {
              main: '#00A0B2',
            },
            success: {
              main: '#4DDA83',
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

  const [hideAppBar, setHideAppBar] = useState(false);
  const prevScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > prevScrollY.current;

      setHideAppBar(scrollingDown); // Hide on down scroll

      prevScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll); // Clean up
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normalize CSS */}
      <Router>
        <Container maxWidth="xl" disableGutters>
          <Box sx={{ padding: 0, margin: 0, flexGrow: 1 }}> {/* Use Box for layout */}
            <Slide direction="down" in={!hideAppBar} mountOnEnter unmountOnExit>
              <AppBar component="nav"> {/* Use AppBar for navigation */}
                <Toolbar>
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    MTG App
                  </Typography>
                  <FormGroup>
                    <FormControlLabel
                      control={<Switch checked={mode === 'dark'} onChange={handleModeChange} />}
                      label={mode === 'dark' ? <i className="ms ms-dfc-night"></i> : <i className="ms ms-dfc-day"></i>}
                    />
                  </FormGroup>
                </Toolbar>
              </AppBar>
            </Slide>
            <Box component="main" sx={{ padding: 2, marginTop: 8 }}> {/* Add some padding around content */}
              <Routes>
                {/* Redirect to /dashboard */}
                {/* Remove the <Navigate to> if a redirect is not wanted */}
                <Route path="/my-mtg-app" element={<Navigate to="/my-mtg-app/dashboard" />} />
                <Route path="/my-mtg-app/dashboard" element={<Dashboard />} />
                <Route path="/my-mtg-app/life-counter" element={<AppLifeCounter />} />
                <Route path="/my-mtg-app/card-list" element={<CardListCreator />} />
                <Route path="/my-mtg-app/info" element={<InformationPage />} />
              </Routes>
            </Box>
            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
              <BottomNavigation
                // showLabels
                value={value}
                onChange={(event, newValue) => {
                  setValue(newValue);
                }}
              >
                <BottomNavigationAction icon={<Icon baseClassName="ms ms-ability-d20"></Icon>} component={Link} to="/my-mtg-app/dashboard" aria-label="Navigate to Dashboard" />
                <BottomNavigationAction icon={<Icon baseClassName="ms ms-20"></Icon>} component={Link} to="/my-mtg-app/life-counter" aria-label="Navigate to Life Counter" />
                <BottomNavigationAction icon={<Icon baseClassName="ms ms-ability-copy"></Icon>} component={Link} to="/my-mtg-app/card-list" aria-label="Navigate to Card List" />
                <BottomNavigationAction icon={<Icon baseClassName="ms ms-tap"></Icon>} component={Link} to="/my-mtg-app/info" aria-label="Navigate to Info" />
              </BottomNavigation>
            </Paper>
          </Box>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
