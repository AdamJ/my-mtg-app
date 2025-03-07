// App.js
import React, { useState, useEffect } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, ButtonGroup, Card, Chip, Grid2, IconButton, List, ListItem, ListItemText, Stack, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Delete, Edit } from '@mui/icons-material'; // Import icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

// In your main App.jsx or another component:
function AppLifeCounter() {
  const [player1Life, setPlayer1Life] = useState(20);
  const [player2Life, setPlayer2Life] = useState(20);
  const [playerName1, setPlayerName1] = useState("Adam");
  const [playerName2, setPlayerName2] = useState("Player 2");
  const [matchHistory, setMatchHistory] = useState(() => { // Initialize from localStorage or empty array
    const storedHistory = localStorage.getItem('matchHistory');
    return storedHistory ? JSON.parse(storedHistory) : [];
  });
  const [editIndex, setEditIndex] = useState(null); // Track the index being edited
  const [editMatch, setEditMatch] = useState(null); // Store the match data for editing
  const countPlayer1 = player1Life;
  const countPlayer2 = player2Life;
  const theme = useTheme();
  const getChipStyle = (count) => {
    return {
      ...( count >= 11 && { backgroundColor: theme.palette.primary.dark, color: theme.palette.common.white }),
      ...(count > 20 && { backgroundColor: theme.palette.success.dark, color: theme.palette.common.white }),
      ...(count <= 10 && { backgroundColor: theme.palette.warning.dark, color: theme.palette.common.white }),
      ...(count <= 5 && { backgroundColor: theme.palette.error.main, color: theme.palette.common.white }),
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

  // Save data to localStorage for Match History
  useEffect(() => {
    localStorage.setItem('matchHistory', JSON.stringify(matchHistory));
  }, [matchHistory]);

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
    setMatchHistory((prevHistory) => [...prevHistory, matchData]); // Use functional update
    setPlayer1Life(20);
    setPlayer2Life(20);
  };

  const clearHistory = () => {
    setMatchHistory([]); // Clear the history state
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
    <Box sx={{
        flexGrow: 1,
        marginBottom: 10,
      }}>
      <Grid2 container spacing={{ xs: 2, md: 3 }} columns={{ xs: 1, sm: 2, md: 12}}>
        {/* Player 2 */}
        <Grid2 size={6} sx={{
          transition: 'transform 0.3s ease',
          '@media (orientation: portrait)': {
            transform: 'rotate(180deg)', // Rotate 180 degrees in portrait
            '& .MuiCard-root': {
              transform: 'rotate(180deg)', // Rotate the Card content back
            },
            '& .MuiStack-root': {
              transform: 'rotate(180deg)',  // Rotate the Stack content back
            },
          },
          '@media (orientation: landscape)': {
            transform: 'rotate(180deg)', // Reset rotation in landscape
          },
          '@media screen and (min-width: 600px)': {
            transform: 'rotate(0deg)',
          },
      }}>
          <Card elevation={3} sx={{ padding: 2 }}>
            <Stack
              spacing={{xs: 2 }}
              direction="column"
              useFlexGap
              sx={{ flexWrap: 'wrap' }}
            >
              <TextField label="Player 2" size="small" fullWidth value={playerName2} onChange={e => setPlayerName2(e.target.value)} />
              <Button color="success" variant="outlined" aria-label="Add one to player 2" sx={{padding: 2}} onClick={() => updateLife(2, 1)}>
                <i className="ms ms-counter-plus"></i>&nbsp;
                Gain A Life
              </Button>
              <Chip color="info" icon={<i className="ms ms-toughness"></i>} label={`${countPlayer2}`} size="large" style={getChipStyle(countPlayer2)} />
              <Button color="error" variant="outlined" aria-label="Remove one from player 2" sx={{padding: 2}} onClick={() => updateLife(2, -1)}>
                <i className="ms ms-counter-minus"></i>&nbsp;
                Lose A Life
              </Button>
            </Stack>
          </Card>
        </Grid2>
        {/* Player 1 */}
        <Grid2 size={6}>
          <Card elevation={3} sx={{ padding: 2 }}>
            <Stack
              spacing={{xs: 2 }}
              direction="column"
              useFlexGap
              sx={{ flexWrap: 'wrap' }}
            >
              <TextField label="Player 1" size="small" fullWidth value={playerName1} onChange={e => setPlayerName1(e.target.value)} />
              <Button color="success" variant="outlined" aria-label="Add one to player 1" sx={{padding: 2}} onClick={() => updateLife(1, 1)}>
                <i className="ms ms-counter-plus"></i>&nbsp;
                Gain a life
              </Button>{' '}
              <Chip color="info" icon={<i className="ms ms-toughness"></i>} label={`${countPlayer1}`} size="large" style={getChipStyle(countPlayer1)} />
              <Button color="error" variant="outlined" aria-label="Remove one from player 1" sx={{padding: 2}} onClick={() => updateLife(1, -1)}>
                <i className="ms ms-counter-minus"></i>&nbsp;
                Lose a life
              </Button>
            </Stack>
          </Card>
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
            <Button variant="contained" color="primary" startIcon={<i className="ms ms-power"></i>} endIcon={<i className="ms ms-power"></i>} onClick={() => handleMatchEnd(playerName2)} size="medium">Winner</Button>
            <Button variant="contained" color="warning" sx={{ paddingX: 10 }} onClick={() => handleMatchEnd("Draw")} size="medium">Draw</Button> {/* Pass "Draw" as string */}
            <Button variant="contained" color="primary" startIcon={<i className="ms ms-power"></i>} endIcon={<i className="ms ms-power"></i>} onClick={() => handleMatchEnd(playerName1)} size="medium">Winner</Button>
          </Stack>
        </Grid2>
      </Grid2>
      {/* Match History */}
      <Accordion slotProps={{ heading: { component: 'h3' } }} sx={
        { marginTop: 4,
          marginBottom: 10,
        }}
        className="match-history">
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
        <ButtonGroup color="secondary" variant="text" aria-label="match history actions" sx={{ padding: 2 }}>
          <Button color="error" key="one" onClick={clearHistory} disabled={matchHistory.length === 0}>
              Clear History
          </Button>
          <Button color="primary" key="two" startIcon={<FileDownloadIcon />} onClick={exportData} disabled={matchHistory.length === 0}>
              Download
          </Button>
        </ButtonGroup>
      </Accordion>
    </Box>
  );
}

export default AppLifeCounter;
