// App.js
import React, { useState, useEffect } from 'react';
import { Box, Chip, Container, Divider, TextField, Button, Grid2, Paper, IconButton, Stack, Fab, List, ListItem, ListItemText } from '@mui/material';
import { useTheme } from '@mui/material/styles';
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
  const countPlayer1 = player1Life;
  const countPlayer2 = player2Life;
  const theme = useTheme();
  const getChipStyle = (count) => {
    return {
      ...(count < 10 && { backgroundColor: theme.palette.warning.dark, color: theme.palette.common.white }),
      ...(count < 5 && { backgroundColor: theme.palette.error.main, color: theme.palette.common.white }),
    };
  };

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
      <Box sx={{
          flexGrow: 1
          // display: "flex",
          // alignItems: "center",
          // border: "1px solid",
          // borderColor: "primary.main",
          // bgcolor: "background.paper",
          // color: "text.primary",
        }}>
        {/* <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, marginBottom: 2 }} align="center" gutterBottom>MTG Life Counter</Typography> */}
        {/* <Paper elevation={0} square={false} sx={{ padding: 2, marginTop: 2 }}> */}
          <Grid2 container spacing={{ xs: 2, md: 3 }} columns={{ xs: 1, sm: 2, md: 12}}>
            {/* Player 2 */}
            <Grid2 size={6}>
              <Stack
                spacing={{xs: 2 }}
                direction="column"
                useFlexGap
                sx={{ flexWrap: 'wrap' }}
              >
                {/* <Typography variant="h5" sx={{marginBottom: 0, marginTop: 1, fontWeight: 600 }}>
                  {playerName2}
                </Typography> */}
                <TextField label="Player 2" size="small" fullWidth value={playerName2} onChange={e => setPlayerName2(e.target.value)} />
                <Button color="success" variant="outlined" aria-label="Add one to player 2" sx={{padding: 2}} onClick={() => updateLife(2, 1)}>
                  <i className="ms ms-counter-plus"></i>&nbsp;
                  Gain A Life
                </Button>
                <Chip icon={<i className="ms ms-toughness"></i>} label={`${countPlayer2}`} size="large" style={getChipStyle(countPlayer2)} />
                <Button color="error" variant="outlined" aria-label="Remove one from player 2" sx={{padding: 2}} onClick={() => updateLife(2, -1)}>
                  <i className="ms ms-counter-minus"></i>&nbsp;
                  Lose A Life
                </Button>
              </Stack>
            </Grid2>
            {/* Player 1 */}
            <Grid2 size={6}>
              <Stack
                spacing={{xs: 2 }}
                direction="column"
                useFlexGap
                sx={{ flexWrap: 'wrap' }}
              >
                {/* <Typography variant="h5" sx={{marginBottom: 0, marginTop: 1, fontWeight: 600 }}>
                  {playerName1}
                </Typography> */}
                <TextField label="Player 1" size="small" fullWidth value={playerName1} onChange={e => setPlayerName1(e.target.value)} />
                <Button color="success" variant="outlined" aria-label="Add one to player 1" sx={{padding: 2}} onClick={() => updateLife(1, 1)}>
                  <i className="ms ms-counter-plus"></i>&nbsp;
                  Gain a life
                </Button>{' '}
                <Chip icon={<i className="ms ms-toughness"></i>} label={`${countPlayer1}`} size="large" style={getChipStyle(countPlayer1)} />
                <Button color="error" variant="outlined" aria-label="Remove one from player 1" sx={{padding: 2}} onClick={() => updateLife(1, -1)}>
                  <i className="ms ms-counter-minus"></i>&nbsp;
                  Lose a life
                </Button>
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
                  marginY: 2,
                }}
              >
                <Button variant="contained" color="primary" startIcon={<i className="ms ms-power"></i>} onClick={() => handleMatchEnd(playerName2)} size="medium">Winner</Button>
                <Button variant="outlined" color="warning" sx={{ paddingX: 10 }} onClick={() => handleMatchEnd("Draw")} size="medium">Draw</Button> {/* Pass "Draw" as string */}
                <Button variant="contained" color="primary" startIcon={<i className="ms ms-power"></i>} onClick={() => handleMatchEnd(playerName1)} size="medium">Winner</Button>
              </Stack>
            </Grid2>
            <Grid2 item xs={12}>
              <Fab sx={{ position: 'fixed', bottom: 75, right: 16 }} color="primary" variant="extended" aria-label="export" onClick={exportData} disabled={matchHistory.length === 0}>
                <FileDownloadIcon sx={{ mr: 1 }} />
                Download
              </Fab>
            </Grid2>
          </Grid2>
        {/* </Paper> */}
          {/* Match History */}
        <Accordion slotProps={{ heading: { component: 'h3' } }} sx={{ marginTop: 4, marginBottom: 10}}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="matchHistory-content"
            id="matchHistory-header"
          >
            Match History
          </AccordionSummary>
          <AccordionDetails>
          <List>
                {matchHistory.map((match, index) => (
                  <ListItem disablePadding key={index} secondaryAction={
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
          </AccordionDetails>
        </Accordion>
      </Box>
    </Container>
  );
}

export default AppLifeCounter;
