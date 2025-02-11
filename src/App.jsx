import React, { useState, useEffect, useRef } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, BottomNavigation, BottomNavigationAction, Paper, Container, Toolbar, Typography, Box, Slide } from '@mui/material'; // Import Material UI components
import AppLifeCounter from './components/AppLifeCounter';
import CardListCreator from './components/CardListCreator';
import InformationPage from './components/InformationPage';
import { ThemeProvider, createTheme } from '@mui/material/styles';

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
                  fontSize: 24,
                  fontWeight: 700,
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
              main: '#E57373',
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
                <Route path="/my-mtg-app/life-counter" element={<AppLifeCounter />} />
                <Route path="/my-mtg-app/card-list" element={<CardListCreator />} />
                <Route path="/my-mtg-app/info" element={<InformationPage />} />
              </Routes>
            </Box>
            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
              <BottomNavigation
                showLabels
                value={value}
                onChange={(event, newValue) => {
                  setValue(newValue);
                }}
              >
                <BottomNavigationAction label="Counter" icon={<i className="ms ms-20"></i>} component={Link} to="/my-mtg-app/life-counter" />
                <BottomNavigationAction label="Cards" icon={<i className="ms ms-planeswalker"></i>} component={Link} to="/my-mtg-app/card-list" />
                <BottomNavigationAction label="Info" icon={<i className="ms ms-tap"></i>} component={Link} to="/my-mtg-app/info" />
              </BottomNavigation>
            </Paper>
          </Box>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
