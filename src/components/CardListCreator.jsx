import React, { useState, useEffect } from 'react';
import { Autocomplete, Avatar, Box, Button, Card, CardContent, CircularProgress, FormControl, Grid2, IconButton, InputLabel, List, ListItem, ListSubheader, ListItemAvatar, ListItemText, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DeleteIcon from '@mui/icons-material/Delete';
import { saveAs } from 'file-saver';
import localForage from 'localforage';
import MyAlert from './MyAlerts';
import cardDataLocal from '../assets/card_data.json';
import ForestIcon from './icons/ForestIcon';
import IslandIcon from './icons/IslandIcon';
import PlainsIcon from './icons/PlainsIcon';
import MountainIcon from './icons/MountainIcon';
import SwampIcon from './icons/SwampIcon';
import ColorlessIcon from './icons/ColorlessIcon';

const CardListCreator = () => {

  const [cardData, setCardData] = useState({});
  const [cardNameOptions, setCardNameOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cardName, setCardName] = useState('');
  const [inputValue, setInputValue] = useState("");
  const [cardNumber, setCardNumber] = useState(1);
  // const [cardCount, setCardCount] = useState(1);
  const [cardType, setCardType] = useState('');
  // const [cardTypes, setCardTypes] = useState([]);
  const [cardColor, setCardColor] = useState('');
  const [landType, setLandType] = useState('');
  // const [landTypeOptions, setLandTypeOptions] = useState([]);
  const [cardColors, setCardColors] = useState({
    White: false,
    Blue: false,
    Black: false,
    Red: false,
    Green: false,
    Colorless: false,
  });
  // const [cardColorOptions, setCardColorOptions] = useState([]);
  const [cardList, setCardList] = useState([]);
  const [cardCounts, setCardCounts] = useState({});
  const [cardNameError, setCardNameError] = useState(false);
  const [groupingOption, setGroupingOption] = useState('type');
  const [selectedCard, setSelectedCard] = useState(null);

  const CARD_LIST_STORAGE_KEY = 'my-app-card-list';

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

  // const handleUpdateCardCount = (index, newCount) => {
  //   const updatedCardList = [...cardList];
  //   updatedCardList[index].count = Math.max(1, parseInt(newCount) || 1);
  //   setCardList(updatedCardList);
  // };


  const handleUpdateCardNumber = (card, newNumber) => {
    setCardCounts(prevCounts => ({
      ...prevCounts,
      [card.name]: Math.max(1, parseInt(newNumber) || 1), // Store by card name
    }));

    // If you need to update the count in cardList itself, do this:
    setCardList(prevList => prevList.map(c =>
      c.name === card.name ? { ...c, number: Math.max(1, parseInt(newNumber) || 1) } : c
    ));
  };

  const handleDeleteCard = (card) => { // Directly pass the card object
    const updatedCardList = cardList.filter(c => c !== card); // Filter by card object
    setCardList(updatedCardList);
    setCardCounts(prevCounts => {
      const newCounts = { ...prevCounts };
      delete newCounts[card.name]; // Remove count for deleted card
      return newCounts;
    });
  };

  useEffect(() => {
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
    setLoading(true);
    try {
      const cardDataByName = {};
      const nameOptions = new Set();
      // const uniqueCardTypes = new Set();
      const uniqueCardColors = new Set();

      cardDataLocal.forEach(card => {
        cardDataByName[card.name] = card;
        nameOptions.add(card.name);

        if (card.type_line) {
          card.type_line.split("—")[0].trim().split(" ").forEach;
        }

        if (card.colors) {
          if (card.colors.length === 0) {
            uniqueCardColors.add("Colorless");
          } else if (card.colors.length === 1) {
            const colorMap = { W: 'White', U: 'Blue', B: 'Black', R: 'Red', G: 'Green' };
            uniqueCardColors.add(colorMap[card.colors[0]] || "Unknown");
          } else {
            uniqueCardColors.add("Multicolor");
          }
        } else {
          uniqueCardColors.add("Colorless");
        }
      });

      setCardData(cardDataByName);
      setCardNameOptions(Array.from(nameOptions));
      // setCardTypes(Array.from(uniqueCardTypes));
      // setCardColorOptions(Array.from(uniqueCardColors));

    } catch (error) {
      console.error("Error loading card data from local JSON:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const renderColorIdentityIcons = (colors) => {
    if (!colors || colors.length === 0) {
      return (
      <Typography sx={{ display: 'inline-block', borderRadius: '50rem', marginLeft: '6px', backgroundColor: '#454545', color: '#ddd', paddingX: '6px', paddingY: '2px' }}>
        <ColorlessIcon />
      </Typography>
      );
    }

    const colorMap = {
      W: <PlainsIcon />,
      U: <IslandIcon />,
      B: <SwampIcon />,
      R: <MountainIcon />,
      G: <ForestIcon />,
      C: <ColorlessIcon />,
      // S: <SnowIcon />,
    };

    return (
      <Typography sx={{ display: 'inline-block', borderRadius: '50rem', marginLeft: '6px', backgroundColor: "#454545", paddingX: '6px', paddingY: '4px' }}>
        {colors.map((colorCode, index) => (
          <span key={index} title={colorMap[colorCode]?.type || colorCode}>
            {colorMap[colorCode]}
          </span>
        ))}
      </Typography>
    );
  };

  const handleAddCard = () => {
    if (cardName.trim() === '') {
      setCardNameError(true);
      return;
    }

    if (!selectedCard) {
      console.error("Card data not found for:", cardName);
      setCardNameError(true);
      return;
    }

    let colorToSave = cardColor;
    if (cardColor === 'Multicolor') {
      const selectedColors = Object.keys(cardColors).filter(color => cardColors[color]);
      colorToSave = selectedColors.join('/');
    } else if (cardColor === 'Colorless') {
      colorToSave = 'Colorless';
    }

    setCardList([...cardList, {
      name: cardName,
      number: cardNumber,
      type: cardType,
      color: colorToSave,
      landType: landType,
      scryfallData: selectedCard,
    }]);

    setCardName('');
    setInputValue('');
    setCardNameError(false);
    setCardType('');
    setCardColor('');
    setCardColors({
      White: false,
      Blue: false,
      Black: false,
      Red: false,
      Green: false,
      Colorless: false
    });
    setLandType('');
    // setLandTypeOptions([]);
    setSelectedCard(null);
  };

  const handleClearDeckList = () => {
    setCardList([]);
  };

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };

  const handleCardNameChange = (event, newValue) => {
    setCardName(newValue || "");
    setInputValue(newValue || "");

    if (newValue && cardData[newValue]) {
      const selectedCardData = cardData[newValue];
      setSelectedCard(selectedCardData);
      setCardNameError(false);
      setCardType(selectedCardData.type_line);

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
      const foundType = Object.keys(typeMatches).find(type => selectedCardData.type_line.includes(type));
      setCardType(foundType || "Other");

      if (selectedCardData.type_line.includes("Land")) {
        // setLandTypeOptions([]);
        setLandType('');
        setCardColor('');
        setCardColors({
          White: false,
          Blue: false,
          Black: false,
          Red: false,
          Green: false,
          Colorless: false,
        });
        return;
      } else {
        // setLandTypeOptions([]);
        setLandType('');
      }

      const colors = selectedCardData.colors || [];
      const colorMap = { W: 'White', U: 'Blue', B: 'Black', R: 'Red', G: 'Green' };

      if (colors.length === 0) {
        setCardColor('Colorless');
        setCardColors({
          White: false,
          Blue: false,
          Black: false,
          Red: false,
          Green: false,
          Colorless: true,
        });
      } else if (colors.length === 1) {
        const color = colorMap[colors[0]] || '';
        setCardColor(color);
        setCardColors({
          White: color === 'White',
          Blue: color === 'Blue',
          Black: color === 'Black',
          Red: color === 'Red',
          Green: color === 'Green',
          Colorless: false,
        });
      } else {
        const colorNames = colors.map(code => colorMap[code] || '');
        setCardColor('Multicolor');
        const newCardColors = {
          White: colorNames.includes('White'),
          Blue: colorNames.includes('Blue'),
          Black: colorNames.includes('Black'),
          Red: colorNames.includes('Red'),
          Green: colorNames.includes('Green'),
          Colorless: false,
        };
        setCardColors(newCardColors);
      }
    } else {
      setCardNameError(true);
      setCardType('');
      setCardColor('');
      setCardColors({
        White: false,
        Blue: false,
        Black: false,
        Red: false,
        Green: false,
        Colorless: false,
      });
      // setLandTypeOptions([]);
      setLandType('');
      setSelectedCard(null);
    }
  };

  const handleExportCSV = () => {
    if (cardList.length === 0) return;

    const header = "Name,Count,Type,Color,Land Type\n";
    const csvData = header + cardList.map(card => {
      const escapedName = card.name.replace(/"/g, '""');
      return `"${escapedName}",${card.count},${card.type},${card.color},${card.landType || ""}`;
    }).join('\n');

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'card_list.csv');
  };

  const groupCards = (cards, option) => {
    const groupedCards = {};
    cards.forEach(card => {
      let groupKey;
      switch (option) {
        case 'color':
          groupKey = card.color;
          break;
        // case 'count':
        //   groupKey = card.count; // Group by card name
        //   break;
        case 'type':
          groupKey = card.type;
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

  const groupedCardList = groupCards(cardList, groupingOption);

  return (
    <Box sx={{ flexGrow: 1, marginBottom: 10 }}>
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
                      value={cardNumber}
                      onChange={e => setCardNumber(Math.max(1, parseInt(e.target.value) || 1))} // Ensure at least 1
                    />
                  </FormControl>
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
                {/* <MenuItem value="count">Count</MenuItem> */}
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
            <List>
          {Object.keys(groupedCardList).map(groupKey => (
                <List key={groupKey} subheader={
                  <ListSubheader><strong>{groupKey}</strong></ListSubheader>
                }>
                  {groupedCardList[groupKey].map((card) => (
                    <ListItem key={card.name}
                      secondaryAction={[
                        <TextField
                          key="1"
                          type="number"
                          size="small"
                          value={cardCounts[card.name] || card.number || 1}
                          onChange={e => handleUpdateCardNumber(card, e.target.value)}
                          sx={{ width: '60px', margin: '0 8px' }}
                        />,
                        <IconButton key="2" edge="end" color="error" onClick={() => handleDeleteCard(card)}>
                          <DeleteIcon />
                        </IconButton>
                      ]}>
                      <ListItemAvatar>
                        <Avatar sx={{ width: 50, height: 50 }}>
                          <img
                            src={card.scryfallData?.image_uris?.normal || 'placeholder_url'}
                            alt={card.name}
                            style={{ objectFit: 'contain', width: '60px' }}
                          />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={card.name}
                        secondary={[
                          <span key="1">
                          <Typography component="span" variant="caption">
                            {card.type}
                          </Typography>
                          </span>,
                          card.scryfallData?.color_identity && (
                            <span key="2">{renderColorIdentityIcons(card.scryfallData?.color_identity)}</span>
                          ),
                          card.scryfallData?.produced_mana && (
                            <span key="3">
                            <Typography component="span" variant="caption" sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '2px' }} color="text.secondary">
                              Produces: {renderColorIdentityIcons(card.scryfallData?.produced_mana)}
                            </Typography>
                            </span>
                          ),
                        ]}
                      />
                    </ListItem>
                  ))}
                </List>
              ))}
            </List>
          </Grid2>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CardListCreator;
