import React, { useState } from 'react';
import { TextField, Button, Grid, Select, MenuItem, InputLabel, Fab, FormControl, Typography, Paper, Checkbox, FormGroup, FormControlLabel } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { saveAs } from 'file-saver'; // Install: npm install file-saver

const CardListCreator = () => {
    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState(1);
    const [cardType, setCardType] = useState('Creature');
    const [cardColor, setCardColor] = useState('Colorless');
    const [cardColors, setCardColors] = useState({  // Store selected colors for Multicolor
        White: false,
        Blue: false,
        Black: false,
        Red: false,
        Green: false,
    });
    const [cardList, setCardList] = useState([]);
    const [cardNameError, setCardNameError] = useState(false); // State for error
    const [groupingOption, setGroupingOption] = useState('color'); // Default grouping option

    const handleAddCard = () => {
      if (cardName.trim() === '') {
          setCardNameError(true);
          return;
      }

      let colorToSave = cardColor;
      if (cardColor === 'Multicolor') {
          const selectedColors = Object.keys(cardColors).filter(color => cardColors[color]);
          colorToSave = selectedColors.join('/');
      }

      // Add cardType to the card object:
      setCardList([...cardList, { name: cardName, number: cardNumber, type: cardType, color: colorToSave }]);

      setCardName('');
      setCardNumber(1);
      setCardType('Creature'); // Reset card type
      setCardColor('Colorless');
      setCardColors({ White: false, Blue: false, Black: false, Red: false, Green: false });
      setCardNameError(false);
    };

      const handleExportCSV = () => {
        if (cardList.length === 0) return;

        // Include cardType in the CSV export:
        const csvData = cardList.map(card => `${card.name},${card.number},${card.type},${card.color}`).join('\n');
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'card_list.csv');
    };

    const handleMulticolorChange = (event) => {
        setCardColors({ ...cardColors, [event.target.name]: event.target.checked });
    };

    // Function to group cards by color, number, or type
    const groupCards = (cards, option) => {
        const groupedCards = {};
        cards.forEach(card => {
            let groupKey;
            switch (option) {
                case 'color':
                    groupKey = card.color;
                    break;
                case 'number':
                    groupKey = card.number;
                    break;
                case 'type':
                    groupKey = card.type; // Now card.type will be available
                    break;
                default:
                    groupKey = 'Ungrouped';
            }

            if (!groupedCards[groupKey]) {
                groupedCards[groupKey] = [];
            }
            groupedCards[groupKey].push(card);
        });
        return groupedCards;
    };

    const groupedCardList = groupCards(cardList, groupingOption); // Group based on selected option

    return (
        <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
            <Typography variant="h5" sx={{ fontSize: { xs: '1.25rem', sm: '1.875rem' }, marginBottom: 2 }} gutterBottom>Deck List</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        label="Card Name"
                        fullWidth
                        value={cardName}
                        onChange={e => setCardName(e.target.value)}
                        error={cardNameError} // Set error prop based on state
                        helperText={cardNameError ? "All cards have names - please add one" : ""} // Error message
                        required // Make the field visually required
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Number"
                        type="number"
                        fullWidth
                        value={cardNumber}
                        onChange={e => setCardNumber(Math.max(1, parseInt(e.target.value) || 1))} // Ensure at least 1
                        inputProps={{ min: 1 }} // Set minimum value in the input field
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel id="card-type">Card Type</InputLabel>
                        <Select
                            labelId="card-type"
                            id="card-type-select"
                            value={cardType}
                            label="Type"
                            onChange={e => setCardType(e.target.value)}
                        >
                            <MenuItem value="Creature">Creature</MenuItem>
                            <MenuItem value="Sorcery">Sorcery</MenuItem>
                            <MenuItem value="Instant">Instant</MenuItem>
                            <MenuItem value="Enchantment">Enchantment</MenuItem>
                            <MenuItem value="Artifact">Artifact</MenuItem>
                            <MenuItem value="Aura">Aura</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel id="color-label">Color</InputLabel>
                        <Select
                            labelId="color-label"
                            id="color-select"
                            value={cardColor}
                            label="Color"
                            onChange={e => setCardColor(e.target.value)}
                        >
                            <MenuItem value="Colorless">Colorless</MenuItem>
                            <MenuItem value="White">White <i className="ms ms-w"></i></MenuItem>
                            <MenuItem value="Blue">Blue <i className="ms ms-u"></i></MenuItem>
                            <MenuItem value="Black">Black <i className="ms ms-b"></i></MenuItem>
                            <MenuItem value="Red">Red <i className="ms ms-r"></i></MenuItem>
                            <MenuItem value="Green">Green <i className="ms ms-g"></i></MenuItem>
                            <MenuItem value="Multicolor">Multicolor</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                {cardColor === 'Multicolor' && ( // Conditionally render color checkboxes
                    <Grid item xs={12}>
                        <FormControl component="fieldset">
                            <FormGroup>
                                {Object.keys(cardColors).map(color => (
                                    <FormControlLabel
                                        key={color}
                                        control={<Checkbox checked={cardColors[color]} onChange={handleMulticolorChange} name={color} />}
                                        label={color}
                                    />
                                ))}
                            </FormGroup>
                        </FormControl>
                    </Grid>
                )}

                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel id="grouping-label">Group By</InputLabel>
                        <Select
                            labelId="grouping-label"
                            id="grouping-select"
                            value={groupingOption}
                            label="Group By"
                            onChange={e => setGroupingOption(e.target.value)}
                        >
                            <MenuItem value="color">Color</MenuItem>
                            <MenuItem value="number">Number</MenuItem>
                            <MenuItem value="type">Type</MenuItem> {/* Add more options as needed */}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12}>
                    <Button variant="contained" onClick={handleAddCard}>Add Card</Button>
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="h6">Card List:</Typography>
                    {Object.keys(groupedCardList).map(groupKey => (
                        <div key={groupKey}>
                            <Typography variant="subtitle1">{groupKey}</Typography>
                            {groupedCardList[groupKey].map((card, index) => (
                                <div key={index}>
                                    {card.name} ({card.number}) - {card.color} <br />
                                    {card.type} {/* Display card type */}
                                </div>
                            ))}
                        </div>
                    ))}
                </Grid>

                <Grid item xs={12}>
                  <Fab color="primary" aria-label="export" onClick={handleExportCSV} disabled={cardList.length === 0}>
                    <FileDownloadIcon />
                  </Fab>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default CardListCreator;
