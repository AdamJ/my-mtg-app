import React, { useState, useEffect } from 'react';
import { Alert, AlertTitle, Autocomplete, Box, Button, Card, CardContent, Checkbox, CircularProgress, FormControl, FormGroup, FormControlLabel, Grid2, IconButton, InputLabel, List, ListItem, ListSubheader, ListItemIcon, ListItemText, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DeleteIcon from '@mui/icons-material/Delete';
import { saveAs } from 'file-saver';
import axios from 'axios';
import localForage from 'localforage';
import MyAlert from './MyAlerts';
import MyColorPicker from './MyColorPicker'; // Import the ColorPicker

localForage.config({
  driver: localForage.INDEXEDDB, // Use IndexedDB
  name: 'scryfallOracleCardsCache' // Distinct name for oracle cards
});

const CardListCreator = () => {

  const [cardData, setCardData] = useState({}); // Store Scryfall card data
  const [loading, setLoading] = useState(false); // Loading state for API calls
  const [cardNameOptions, setCardNameOptions] = useState([]); // Autocomplete options
  const [cardName, setCardName] = useState('');
  const [inputValue, setInputValue] = useState("");
  const [cardCount, setCardCount] = useState(1);
  const [cardType, setCardType] = useState('Creature');
  const [cardColor, setCardColor] = useState('Colorless');
  const [landType, setLandType] = useState(''); // State for land type
  const [landTypeOptions, setLandTypeOptions] = useState([]); // Options for land type
  const [cardColors, setCardColors] = useState({
    White: false,
    Blue: false,
    Black: false,
    Red: false,
    Green: false,
    Colorless: false, // Changed from None to Colorless
  });
  const [cardList, setCardList] = useState([]);
  const [cardNameError, setCardNameError] = useState(false); // State for error
  const [groupingOption, setGroupingOption] = useState('type'); // Default grouping option

  const handleUpdateCardCount = (index, newCount) => {
    const updatedCardList = [...cardList];
    updatedCardList[index].count = Math.max(1, parseInt(newCount) || 1); // Ensure at least 1
    setCardList(updatedCardList);
  };
  const handleDeleteCard = (index) => {
    const updatedCardList = cardList.filter((_, i) => i !== index);
    setCardList(updatedCardList);
  };

  const CARD_LIST_STORAGE_KEY = 'my-app-card-list'; // Key for localForage

  useEffect(() => {
    const loadCardList = async () => {
      try {
        const storedCardList = await localForage.getItem(CARD_LIST_STORAGE_KEY);
        if (storedCardList) {
          setCardList(storedCardList);
        }
      } catch (error) {
        console.error("Error loading card list from localForage:", error);
      }
    };
    loadCardList();
  }, []);

  useEffect(() => {
    // Save card list to localForage whenever it changes
    const saveCardList = async () => {
      try {
        await localForage.setItem(CARD_LIST_STORAGE_KEY, cardList);
      } catch (error) {
        console.error("Error saving card list to localForage:", error);
      }
    };

    saveCardList();
  }, [cardList]);

  useEffect(() => {
    const loadCardData = async () => {
      setLoading(true);
      try {
        const storedCardData = await localForage.getItem('scryfallOracleCardData');
        const storedCardNames = await localForage.getItem('scryfallOracleCardNames');

        if (storedCardData && storedCardNames) {
          setCardData(storedCardData);
          setCardNameOptions(storedCardNames);
          console.log("Loaded oracle card data from IndexedDB");
        } else {
          const response = await axios.get('https://api.scryfall.com/bulk-data/oracle-cards');
          const bulkDataUrl = response.data.download_uri; // Correct path for oracle-cards

          const cardDataResponse = await axios.get(bulkDataUrl);
          const allCards = cardDataResponse.data;

          const cardDataByName = {};
          const nameOptions = new Set();
          allCards.forEach(card => {
            cardDataByName[card.name] = card;
            nameOptions.add(card.name);
          });

          await localForage.setItem('scryfallOracleCardData', cardDataByName);
          await localForage.setItem('scryfallOracleCardNames', Array.from(nameOptions));
          console.log("Fetched and stored oracle card data in IndexedDB");

          setCardData(cardDataByName);
          setCardNameOptions(Array.from(nameOptions));
        }
      } catch (error) {
        console.error("Error fetching or loading oracle card data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCardData();
  }, []);

  const handleAddCard = () => {
    if (cardName.trim() === '') {
      setCardNameError(true);
      return;
    }

    const selectedCardData = cardData[cardName]; // Access card data

    if (!selectedCardData) {
      console.error("Card data not found for:", cardName);
      setCardNameError(true); // Indicate error if card data not found
      return;
    }

    let colorToSave = cardColor;
    if (cardColor === 'Multicolor') {
      const selectedColors = Object.keys(cardColors).filter(color => cardColors[color]);
      colorToSave = selectedColors.join('/');
    } else if (cardColor === 'Colorless') { // Handle Colorless case
      colorToSave = 'Colorless';
    }

    // Add cardType to the card object:
    setCardList([...cardList, {
      name: cardName,
      count: cardCount,
      type: cardType,
      color: colorToSave,
      landType: landType,
      scryfallData: selectedCardData // Store Scryfall data
    }]);

    // Clear the card name field and reset related state
    setCardName('');
    setInputValue(''); // Also clear the input value for the autocomplete
    setCardNameError(false); // Clear any errors
    setCardType(''); // or set to your default type
    setCardColor(''); // or set to your default color
    setCardColors({
      White: false,
      Blue: false,
      Black: false,
      Red: false,
      Green: false,
      Colorless: false
    });
    setLandType('');
    setLandTypeOptions([]);
  };

  const handleClearDeckList = () => {
    setCardList([]); // Clear the card list
  };

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };

  const handleCardNameChange = (event, newValue) => {
    setCardName(newValue || "");
    setInputValue(newValue || "");

    if (newValue && cardData[newValue]) {
      const selectedCard = cardData[newValue];

      setCardNameError(false);

      // Set Card Type (simplified)
      const typeMatches = {
        Artifact: "Artifact",
        Battle: "Battle",
        Conspiracy: "Conspiracy",
        Creature: "Creature",
        Dungeon: "Dungeon",
        Emblem: "Emblem",
        Enchantment: "Enchantment",
        Hero: "Hero",
        Instant: "Instant",
        Kindred: "Kindred",
        Land: "Land",
        Phenomenon: "Phenomenon",
        Plane: "Plane",
        Planeswalker: "Planeswalker",
        Scheme: "Scheme",
        Sorcery: "Sorcery",
        Vanguard: "Vanguard",
      };
      const foundType = Object.keys(typeMatches).find(type => selectedCard.type_line.includes(type));
      setCardType(foundType || "Other"); // Default to "Other" if no match

      // Set Land Type and Options (if card is a land)
      if (selectedCard.type_line.includes("Land")) {
        const landTypes = selectedCard.type_line.split("—")[1]?.trim().split(" // ")[0].split("/");
        setLandTypeOptions(landTypes || []);
        setLandType(landTypes?.length > 0 ? landTypes[0] : '');

        return;
      } else {
        setLandTypeOptions([]);
        setLandType('');
      }

      // Set Card Color (only if NOT a land)
      const colors = selectedCard.colors?.map(color => ({ W: 'White', U: 'Blue', B: 'Black', R: 'Red', G: 'Green', N: 'None' }[color])) || ['Colorless'];
      setCardColor(colors.length > 1 ? 'Multicolor' : colors[0]);

      const newCardColors = { White: false, Blue: false, Black: false, Red: false, Green: false, None: false };
      colors.forEach(color => newCardColors[color] = true);
      setCardColors(newCardColors);

    } else {
      setCardNameError(true);
      setCardType('Artifact');
      setCardColor('Colorless');
      setCardColors({
        White: false,
        Blue: false,
        Black: false,
        Red: false,
        Green: false,
        None: false
        });
        setLandTypeOptions([]);
        setLandType('');
    }
  };

  const handleExportCSV = () => {
    if (cardList.length === 0) return;

    const header = "Name,Count,Type,Color,Land Type\n";
    const csvData = header + cardList.map(card => {
      const escapedName = card.name.replace(/"/g, '""'); // Escape double quotes
      return `"${escapedName}",${card.count},${card.type},${card.color},${card.landType || ""}`; // Enclose in double quotes
    }).join('\n');

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'card_list.csv');
  };

  const handleMulticolorChange = (event) => {
    setCardColors({ ...cardColors, [event.target.name]: event.target.checked });
  };

  // Function to group cards by color, card, or type
  const groupCards = (cards, option) => {
    const groupedCards = {};
    cards.forEach(card => {
      let groupKey;
      switch (option) {
        case 'color':
        groupKey = card.color;
        break;
        case 'card':
        groupKey = card.card;
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
    <Box sx={{ flexGrow: 1, marginBottom: 10,}}>
      <Typography variant="h5" sx={{ fontSize: { xs: '1.25rem', sm: '1.875rem' }, marginBottom: 2 }} gutterBottom>
        Deck List
      </Typography>
      <MyAlert />
      <Card sx={{ marginBottom: 4 }}>
        <CardContent>
          <Typography variant="h5" component="div" sx={{ marginBottom: 2 }}>
            Add Cards
          </Typography>
            <Grid2 container spacing={{ xs: 2 }}>
              <Grid2 item size={{ xs: 12 }}>
                <Stack direction="row" spacing={2}>
                  <FormControl sx={{ minWidth: 175 }} size="small" fullWidth>
                    <Autocomplete
                      value={cardName}
                      inputValue={inputValue}  // Control input value
                      onChange={handleCardNameChange}
                      onInputChange={handleInputChange} // Handle input change
                      options={cardNameOptions}
                      freeSolo // Allow typing in values not in the options
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Card Name"
                          size="small"
                          error={cardNameError}
                          helperText={cardNameError ? "Card not found" : "Begin typing to search Scryfall"}
                          required
                          InputProps={{
                            ...params.InputProps, // Spread existing InputProps
                            endicon: loading ? <CircularProgress size={20} /> : null,
                        }}
                          sx={{
                            minWidth: 150,
                            '& .MuiInputLabel-root': { color: 'gray' },
                            '& .MuiInoutLabel-shrink': { color: 'blue' }
                          }}
                          autoComplete="off"
                        />
                      )}
                      // Case-insensitive filtering:
                      filterOptions={(options, params) => {
                        const filter = params.inputValue.toLowerCase();
                        return options.filter(option => option.toLowerCase().includes(filter));
                      }}
                    />
                  </FormControl>
                  <FormControl size="small">
                    <TextField
                      label="Count"
                      type="number"
                      size="small"
                      value={cardCount}
                      onChange={e => setCardCount(Math.max(1, parseInt(e.target.value) || 1))} // Ensure at least 1
                    />
                  </FormControl>
                </Stack>
              </Grid2>
            </Grid2>
            <Grid2 container spacing={{ xs: 2 }} sx={{ paddingTop: 2 }}>
              {/* Card Type select */}
              <Grid2 item spacing={2} size={{ xs: 12, md: 6 }}>
                <Stack direction="row" spacing={2}>
                  <FormControl sx={{ minWidth: 175 }} size="small" fullWidth disabled>
                    <InputLabel id="card-type">Card Type</InputLabel>
                    <Select
                      labelId="card-type"
                      id="card-type-select"
                      helperText="Card type populated by Card Name"
                      value={cardType}
                      label="Type"
                      onChange={e => setCardType(e.target.value)}
                    >
                      <MenuItem value="Artifact">Artifact</MenuItem>,
                      <MenuItem value="Battle">Battle</MenuItem>,
                      <MenuItem value="Conspiracy">Conspiracy</MenuItem>,
                      <MenuItem value="Creature">Creature</MenuItem>
                      <MenuItem value="Dungeon">Dungeon</MenuItem>,
                      <MenuItem value="Emblem">Emblem</MenuItem>,
                      <MenuItem value="Enchantment">Enchantment</MenuItem>
                      <MenuItem value="Hero">Hero</MenuItem>,
                      <MenuItem value="Instant">Instant</MenuItem>
                      <MenuItem value="Kindred">Kindred</MenuItem>,
                      <MenuItem value="Land">Land</MenuItem>
                      <MenuItem value="Phenomenon">Phenomenon</MenuItem>,
                      <MenuItem value="Plane">Plane</MenuItem>,
                      <MenuItem value="Planeswalker">Planeswalker</MenuItem>
                      <MenuItem value="Scheme">Scheme</MenuItem>,
                      <MenuItem value="Sorcery">Sorcery</MenuItem>
                      <MenuItem value="Vanguard">Vanguard</MenuItem>,
                    </Select>
                  </FormControl>
                  {/* Automatically selected by Scryfall */}
                  {cardType === 'Land' && (
                  <FormControl sx={{ marginLeft: 1, minWidth: 175 }} size="small" fullWidth disabled>
                    <InputLabel id="land-type-label">Land Type</InputLabel>
                    <Select
                      labelId="land-type-label"
                      id="land-type-select"
                      value={landType} // Value MUST be a valid option
                      label="Land Type"
                      onChange={e => setLandType(e.target.value)}
                    >
                      <MenuItem value="">{/* Add empty string option */}</MenuItem> {/* Important! */}
                      {landTypeOptions.map(type => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  )}
                </Stack>
              </Grid2>
              {/* Color select */}
              <Grid2 item size={{ xs: 12, md: 6 }}>
                <Stack direction="row" spacing={2}>
                  <FormControl sx={{ minWidth: 100 }} size="small" fullWidth disabled>
                    <InputLabel id="color-label">Color</InputLabel>
                    <Select
                      labelId="color-label"
                      id="color-select"
                      value={cardColor}
                      label="Color"
                      onChange={e => setCardColor(e.target.value)}
                    >
                      <MenuItem value="Colorless">Colorless</MenuItem> {/* Colorless Option */}
                      <MenuItem value="White">White</MenuItem>
                      <MenuItem value="Blue">Blue</MenuItem>
                      <MenuItem value="Black">Black</MenuItem>
                      <MenuItem value="Red">Red</MenuItem>
                      <MenuItem value="Green">Green</MenuItem>
                      <MenuItem value="Multicolor">Multicolor</MenuItem>
                    </Select>
                  </FormControl>
                  {/* {cardColor === 'Multicolor' && ( */}
                    <MyColorPicker cardColors={cardColors} setCardColors={setCardColors} />
                  {/* )} */}
                </Stack>
              </Grid2>
            </Grid2>
            <Grid2 item sx={{ paddingY: 2 }} xs={12}>
              <Button variant="contained" onClick={handleAddCard}>Add Card</Button>
            </Grid2>
          </CardContent>
        </Card>
        {/* Group by, Clear, Download */}
        <Grid2 container spacing={2} columns={{ xs: 1, sm: 2, md: 12}} sx={{ margin: 2 }}>
          <Grid2 item size={{ xs: 4 }}>
            <FormControl sx={{ minWidth: 120 }} size="small">
              <InputLabel id="grouping-label">Group By</InputLabel>
              <Select
                labelId="grouping-label"
                id="grouping-select"
                value={groupingOption}
                label="Group By"
                autoWidth
                onChange={e => setGroupingOption(e.target.value)}
              >
                <MenuItem value="type">Type</MenuItem>
                <MenuItem value="color">Color</MenuItem>
                <MenuItem value="count">Count</MenuItem>
              </Select>
            </FormControl>
          </Grid2>
          <Grid2 display="flex" justifyContent="end" item size={{ xs: 8 }}>
            <Button variant="text" aria-label="clear deck list" onClick={handleClearDeckList}>
            Clear Deck List</Button>
            <Button variant="outlined" startIcon={<FileDownloadIcon />} aria-label="export to csv" onClick={handleExportCSV} disabled={cardList.length === 0}>
              Download Deck List
            </Button>
          </Grid2>
        </Grid2>
        <Card>
          <CardContent>
            <Grid2 item xs={12}>
              <Typography variant="h5" component="div">List</Typography>
              {Object.keys(groupedCardList).map(groupKey => (
              <List key={groupKey} subheader={<ListSubheader>{groupKey}</ListSubheader>}>
              {/* ... (groupKey JSX) */}

              {groupedCardList[groupKey].map((card, index) => (
                <ListItem key={index}> {/* Add flexbox for alignment */}
                  <ListItemIcon>
                    <img src={card.scryfallData.image_uris?.normal} alt={card.name} style={{ objectFit: 'contain', width: '50px' }} />
                  </ListItemIcon>
                  <ListItemText primary={card.name} secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="subtitle2"
                        sx={{ display: 'inline' }}
                      >
                        {card.type}
                      </Typography> - {card.color}
                    </React.Fragment>
                  }
                  />
                  {/* Count Input */}
                  <TextField
                    type="number"
                    size="small"
                    value={card.count}
                    onChange={e => handleUpdateCardCount(groupedCardList[groupKey].indexOf(card) + Object.keys(groupedCardList).slice(0, Object.keys(groupedCardList).indexOf(groupKey)).reduce((acc, curr) => acc + groupedCardList[curr].length, 0), e.target.value)} // Pass index and new value
                    sx={{ width: '60px', margin: '0 8px' }} // Adjust width and add margin
                  />
                  {/* ... (Scryfall data JSX) */}

                   {/* Delete Button */}
                  <IconButton aria-label="delete" onClick={() => handleDeleteCard(cardList.indexOf(card))}>
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          ))}
            </Grid2>
          </CardContent>
        </Card>
    </Box>
  );
};

export default CardListCreator;
