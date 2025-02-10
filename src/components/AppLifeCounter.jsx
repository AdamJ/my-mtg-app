// App.js
import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, TextField, Button, Grid2, Paper, IconButton, Stack, Fab, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { Edit, Delete } from '@mui/icons-material'; // Import icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

// In your main App.jsx or another component:
function AppLifeCounter() {
  const [player1Life, setPlayer1Life] = useState(20);
  const [player2Life, setPlayer2Life] = useState(20);
  const [playerName1, setPlayerName1] = useState("Adam");
  const [playerName2, setPlayerName2] = useState("Player 2");
  const [matchHistory, setMatchHistory] = useState([]); // Array to store match data
  const [editIndex, setEditIndex] = useState(null); // Track the index being edited
  const [editMatch, setEditMatch] = useState(null); // Store the match data for editing

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('mtgLifeCounterData'));
    if (savedData) {
      setPlayer1Life(savedData.player1Life);
      setPlayer2Life(savedData.player2Life);
      setPlayerName1(savedData.playerName1);
      setPlayerName2(savedData.playerName2);
      setMatchHistory(savedData.matchHistory);
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    const dataToSave = { player1Life, player2Life, playerName1, playerName2, matchHistory };
    localStorage.setItem('mtgLifeCounterData', JSON.stringify(dataToSave));
  }, [player1Life, player2Life, playerName1, playerName2, matchHistory]);


  const updateLife = (player, change) => {
    if (player === 1) {
      setPlayer1Life(Math.max(0, player1Life + change)); // Prevent life from going below 0
    } else {
      setPlayer2Life(Math.max(0, player2Life + change));
    }
  };

  const handleEditMatch = (index) => {
    setEditIndex(index);
    setEditMatch({ ...matchHistory[index] }); // Create a copy for editing
  };

  const handleSaveEdit = (index) => {
    const updatedMatchHistory = [...matchHistory];
    updatedMatchHistory[index] = { ...editMatch }; // Important: Create a new object!
    setMatchHistory(updatedMatchHistory);
    setEditIndex(null); // Exit edit mode
    setEditMatch(null);
  };

  const handleDeleteMatch = (index) => {
    const updatedMatchHistory = matchHistory.filter((_, i) => i !== index);
    setMatchHistory(updatedMatchHistory);
  };

  const handleEditInputChange = (field, value) => {
    if (field === 'player1Life' || field === 'player2Life') {
      const numValue = parseInt(value, 10);
      setEditMatch({ ...editMatch, [field]: isNaN(numValue) ? 0 : numValue });
    } else {
      setEditMatch({ ...editMatch, [field]: value }); // Handles playerName and winner
    }
  };

  const handleMatchEnd = (winnerName) => { // Now takes winner's name
    const matchData = {
      player1: playerName1,
      player2: playerName2,
      player1Life: player1Life,
      player2Life: player2Life,
      winner: winnerName, // Store winner's name directly
      date: new Date().toLocaleDateString(),
    };
    setMatchHistory([...matchHistory, matchData]);
    setPlayer1Life(20);
    setPlayer2Life(20);
  };

  const exportData = () => {
    const dataToExport = { player1Life, player2Life, playerName1, playerName2, matchHistory };
    const jsonString = JSON.stringify(dataToExport, null, 2); // Beautified JSON

    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mtg_data.json';
    link.click();
    URL.revokeObjectURL(url); // Clean up
  };

  return (
    <Container>
      <Box sx={{ flexGrow: 1 }}>
        <Paper elevation={3} square={false} sx={{ padding: 3, marginTop: 4 }}>
          <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, marginBottom: 2 }} align="center" gutterBottom>MTG Life Counter</Typography>
          <Grid2 container spacing={{ xs: 2, md: 3 }} columns={{ xs: 1, sm: 2, md: 12}}>
            {/* Player Name Inputs */}
            <Grid2 size={12}>
              <Accordion defaultExpanded>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="playerName-content"
                  id="playerName-header"
                >
                  Player Names
                </AccordionSummary>
                <AccordionDetails>
                  <Stack direction="row" spacing={2}>
                    <TextField label="Player 1" size="small" fullWidth value={playerName1} onChange={e => setPlayerName1(e.target.value)} />
                    <TextField label="Player 2" size="small" fullWidth value={playerName2} onChange={e => setPlayerName2(e.target.value)} />
                  </Stack>
                </AccordionDetails>
              </Accordion>
            </Grid2>
            {/* Player 1 */}
            <Grid2 size={6}>
              <Stack
                spacing={{xs: 2 }}
                direction="column"
                useFlexGap
                sx={{ flexWrap: 'wrap' }}
              >
                <Typography variant="h5" sx={{marginBottom: 1, marginTop: 2, fontWeight: 600 }}>
                  {playerName1}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                  <List>
                    <ListItem>
                      <ListItemIcon sx={{ fontSize: 36 }}>
                        <i className="ms ms-toughness"></i>
                      </ListItemIcon>
                      <ListItemText
                        primaryTypographyProps={{
                          fontSize: 48,
                          fontWeight: 'medium',
                          letterSpacing: 0,
                        }}
                        primary={player1Life}
                      />
                    </ListItem>
                  </List>
                  <Button variant="contained" color="primary" startIcon={<i className="ms ms-power"></i>} onClick={() => handleMatchEnd(playerName1)} size="medium">{playerName1} Wins</Button>
                </Box>
                <Fab color="success" variant="extended" aria-label="Add one to player 1" onClick={() => updateLife(1, 1)}>
                  <i className="ms ms-counter-plus"></i>&nbsp;
                  Plus One
                </Fab>{' '}
                <Fab color="error" variant="extended" aria-label="Remove one from player 1" onClick={() => updateLife(1, -1)}>
                  <i className="ms ms-counter-minus"></i>&nbsp;
                  Minus One
                </Fab>
              </Stack>
            </Grid2>
            {/* Player 2 */}
            <Grid2 size={6}>
              <Stack
                spacing={{xs: 2 }}
                direction="column"
                useFlexGap
                sx={{ flexWrap: 'wrap' }}
              >
                <Typography variant="h5" sx={{marginBottom: 1, marginTop: 2, fontWeight: 600 }}>
                  {playerName2}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                  <List>
                    <ListItem>
                      <ListItemIcon sx={{ fontSize: 36 }}>
                        <i className="ms ms-toughness"></i>
                      </ListItemIcon>
                      <ListItemText
                        primaryTypographyProps={{
                          fontSize: 48,
                          fontWeight: 'medium',
                          letterSpacing: 0,
                        }}
                        primary={player2Life}
                      />
                    </ListItem>
                  </List>
                  <Button variant="contained" color="primary" startIcon={<i className="ms ms-power"></i>} onClick={() => handleMatchEnd(playerName2)} size="medium">{playerName2} Wins</Button>
                </Box>
                <Fab color="success" variant="extended" aria-label="Add one to player 2" onClick={() => updateLife(2, 1)}>
                  <i className="ms ms-counter-plus"></i>&nbsp;
                  Plus One
                </Fab>{' '}
                <Fab color="error" variant="extended" aria-label="Remove one from player 2" onClick={() => updateLife(2, -1)}>
                  <i className="ms ms-counter-minus"></i>&nbsp;
                  Minus One
                </Fab>
              </Stack>
            </Grid2>
          </Grid2>
          {/* Set game winner */}
          <Grid2 spacing={2}>
            <Grid2 item xs={12}>
              <Stack
                direction="row"
                spacing={2}
                useFlexGap
                sx={{
                  flexWrap: 'wrap',
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 2,
                }}
              >
                <Button variant="outlined" color="warning" onClick={() => handleMatchEnd("Draw")} size="medium">Draw</Button> {/* Pass "Draw" as string */}
              </Stack>
            </Grid2>
            {/* Match History */}
            <Grid2 item xs={12}>
              <Typography variant="h6" sx={{ marginBottom: 2 }}>Match History:</Typography>
              <List>
                {matchHistory.map((match, index) => (
                  <ListItem key={index} secondaryAction={
                    <>
                      {editIndex === index ? (
                        <>
                          <TextField
                            label="Player 1 Life"
                            type="number"
                            value={editMatch.player1Life}
                            onChange={(e) => handleEditInputChange('player1Life', e.target.value)}
                            size="small"
                            sx={{ mr: 1 }}
                          />
                          <TextField
                            label="Player 2 Life"
                            type="number"
                            value={editMatch.player2Life}
                            onChange={(e) => handleEditInputChange('player2Life', e.target.value)}
                            size="small"
                            sx={{ mr: 1 }}
                          />
                          <TextField
                            label="Winner"
                            value={editMatch.winner} // Now directly uses the name
                            onChange={(e) => handleEditInputChange('winner', e.target.value)}
                            size="small"
                            sx={{ mr: 1 }}
                          />
                          <Button onClick={() => handleSaveEdit(index)} size="small" variant="contained">Save</Button>
                        </>
                      ) : (
                        <IconButton onClick={() => handleEditMatch(index)}>
                          <Edit />
                        </IconButton>
                      )}
                      <IconButton onClick={() => handleDeleteMatch(index)} color="error">
                        <Delete />
                      </IconButton>
                    </>
                  }>
                  <ListItemText
                    primary={`${match.player1} (${match.player1Life}) vs ${match.player2} (${match.player2Life})`}
                    secondary={
                      <React.Fragment>
                        <strong>Winner: {match.winner}</strong> - <em>{match.date}</em> {/* Display the name directly */}
                      </React.Fragment>
                    }
                  />
                </ListItem>
                ))}
              </List>
            </Grid2>
            <Grid2 item xs={12}>
              <Fab color="primary" variant="extended" aria-label="export" onClick={exportData} disabled={matchHistory.length === 0}>
                <FileDownloadIcon sx={{ mr: 1 }} />
                Download
              </Fab>
            </Grid2>
          </Grid2>
        </Paper>
      </Box>
    </Container>
  );
}

export default AppLifeCounter;
