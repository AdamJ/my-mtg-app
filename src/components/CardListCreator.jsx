import React, { useState, useEffect } from 'react';
import { Alert, AlertTitle, Autocomplete, Box, Button, Card, CardContent, Checkbox, CircularProgress, Divider, FormControl, FormGroup, FormHelperText, FormControlLabel, Grid2, InputLabel, Link, MenuItem, Select, TextField, Typography } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { saveAs } from 'file-saver';
import axios from 'axios';
import localForage from 'localforage';

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
  const [cardNumber, setCardNumber] = useState(1);
  const [cardType, setCardType] = useState('Creature');
  const [cardColor, setCardColor] = useState('Colorless');
  const [landType, setLandType] = useState(''); // State for land type
  const [landTypeOptions, setLandTypeOptions] = useState([]); // Options for land type
  const [cardColors, setCardColors] = useState({  // Store selected colors for Multicolor
    White: false,
    Blue: false,
    Black: false,
    Red: false,
    Green: false,
    None: false,
  });
  const [cardList, setCardList] = useState([]);
  const [cardNameError, setCardNameError] = useState(false); // State for error
  const [groupingOption, setGroupingOption] = useState('type'); // Default grouping option

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
    }

    // Add cardType to the card object:
    setCardList([...cardList, {
      name: cardName,
      number: cardNumber,
      type: cardType,
      color: colorToSave,
      landType: landType,
      scryfallData: selectedCardData // Store Scryfall data
    }]);

    setCardList([...cardList, {
      name: cardName,
      number: cardNumber,
      type: cardType,
      color: colorToSave,
      landType: landType, // Add land type to card object
      scryfallData: selectedCardData
    }]);
    // ... (reset state after adding card, including landType)
    setLandType(''); // Reset land type
    setLandTypeOptions([]); // Reset land type options
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
        Consipiracy: "Conspiracy",
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

    const header = "Name,Number,Type,Color,Land Type\n"; // Add Land Type to header
    const csvData = header + cardList.map(card => `${card.name},${card.number},${card.type},${card.color},${card.landType || ""}`).join('\n'); // Add landType to CSV data
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
    <Box sx={{ flexGrow: 1, marginBottom: 10,}}>
      <Typography variant="h5" sx={{ fontSize: { xs: '1.25rem', sm: '1.875rem' }, marginBottom: 2 }} gutterBottom>
        Deck List
      </Typography>
      <Alert severity="info">
        <AlertTitle>Heads Up!</AlertTitle>Scryfall integrations are a work in progress. If the Card Type or Color is incorrect, you may change it before adding the card to your deck list.
      </Alert>
      <Card sx={{ marginBottom: 4 }}>
        <CardContent>
          <Grid2 container spacing={{ xs: 2, md: 4 }} columns={{ xs: 1, sm: 2, md: 8}}>
            <Grid2 item xs={12} md={3}>
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
                    fullWidth
                    size="small"
                    error={cardNameError}
                    helperText={cardNameError ? "Card not found" : "Begin typing to search Scryfall"}
                    required
                    InputProps={{
                      ...params.InputProps, // Spread existing InputProps
                      endicon: loading ? <CircularProgress size={20} /> : null,
                  }}
                    sx={{
                      minWidth: 300,
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
            </Grid2>
            <Grid2 item size={{ xs: 12, md: 1 }}>
              <TextField
                label="Number"
                type="number"
                size="small"
                value={cardNumber}
                onChange={e => setCardNumber(Math.max(1, parseInt(e.target.value) || 1))} // Ensure at least 1
              />
            </Grid2>
            <Grid2 container size={{ xs: 12 }} spacing={2}>
              <FormControl sx={{ minWidth: 175 }} size="small">
                <InputLabel id="card-type">Card Type</InputLabel>
                  <Select
                    labelId="card-type"
                    id="card-type-select"
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
                {cardType === 'Land' && (
                  <FormControl sx={{ minWidth: 175 }} size="small" disabled>
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
                <FormControl sx={{ minWidth: 80 }} size="small">
                  <InputLabel id="color-label">Color</InputLabel>
                    <Select
                    labelId="color-label"
                    id="color-select"
                    value={cardColor}
                    label="Color"
                    onChange={e => setCardColor(e.target.value)}
                    >
                      <MenuItem value="None">None</MenuItem>
                      <MenuItem value="Colorless">Colorless</MenuItem>
                      <MenuItem value="White">White <i className="ms ms-w"></i></MenuItem>
                      <MenuItem value="Blue">Blue <i className="ms ms-u"></i></MenuItem>
                      <MenuItem value="Black">Black <i className="ms ms-b"></i></MenuItem>
                      <MenuItem value="Red">Red <i className="ms ms-r"></i></MenuItem>
                      <MenuItem value="Green">Green <i className="ms ms-g"></i></MenuItem>
                      <MenuItem value="Multicolor">Multicolor</MenuItem>
                    </Select>
                  </FormControl>
                {cardColor === 'Multicolor' && ( // Conditionally render color checkboxes
                  <FormControl component="fieldset">
                    <FormGroup row>
                      {Object.keys(cardColors).map(color => (
                        <FormControlLabel
                        key={color}
                        control={<Checkbox checked={cardColors[color]} onChange={handleMulticolorChange} name={color} />}
                        label={color}
                        />
                      ))}
                    </FormGroup>
                    <FormHelperText>Select the colors</FormHelperText>
                  </FormControl>
                )}
              </Grid2>
              <Divider component="div" />
            </Grid2>
            <Grid2 item xs={12}>
              <Button variant="contained" onClick={handleAddCard}>Add Card</Button>
            </Grid2>
          </CardContent>
        </Card>
        <Grid2 container spacing={{ xs: 2, md: 4 }} columns={{ xs: 1, sm: 2, md: 8}} sx={{ margin: 2 }}>
          <Grid2 item xs={4}>
            <FormControl sx={{ minWidth: 120 }} size="small">
              <InputLabel id="grouping-label">Group By</InputLabel>
              <Select
                labelId="grouping-label"
                id="grouping-select"
                value={groupingOption}
                label="Group By"
                onChange={e => setGroupingOption(e.target.value)}
              >
                <MenuItem value="type">Type</MenuItem>
                <MenuItem value="color">Color</MenuItem>
                <MenuItem value="number">Number</MenuItem>
              </Select>
            </FormControl>
          </Grid2>
          <Grid2 item xs={4}>
            <Button variant="outlined" startIcon={<FileDownloadIcon />} aria-label="export to csv" onClick={handleExportCSV} disabled={cardList.length === 0}>
              Download Deck List
            </Button>
          </Grid2>
        </Grid2>
        <Card>
          <CardContent>
            <Grid2 item xs={12}>
              <Typography variant="h5">List:</Typography>
              {Object.keys(groupedCardList).map(groupKey => (
              <div key={groupKey}>
                <Typography variant="subtitle1"><strong>Group: {groupKey}</strong></Typography>
                {groupedCardList[groupKey].map((card, index) => (
                  <div key={index}>
                    <Link
                      href={`https://scryfall.com/card/vma/324/=${encodeURIComponent(card.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {card.name}
                    </Link>&nbsp;
                    ({card.number}) - {card.color} {card.type}
                    {/* Accessing Scryfall data */}
                    {card.scryfallData && (
                    <div>
                      <img src={card.scryfallData.image_uris?.normal} alt={card.name} style={{ objectFit: 'contain', width: '100px' }} />
                    </div>
                    )}
                  </div>
                ))}
              </div>
              ))}
            </Grid2>
          </CardContent>
        </Card>
    </Box>
  );
};

export default CardListCreator;
