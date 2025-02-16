import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';

const cardColorOptions = [
  "White", "Blue", "Black", "Red", "Green", "Colorless", "Multicolor"
];

const MyColorPicker = ({ cardColors, setCardColors, colorType }) => { // Now receives setCardColors

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    handleMulticolorChange(typeof value === 'string' ? value.split(',') : value);
  };

  const handleMulticolorChange = (selectedColors) => {  // Definition of the function
    setCardColors(prevColors => {
      const newColors = { ...prevColors };
      Object.keys(newColors).forEach(color => {
        newColors[color] = selectedColors.includes(color);
      });
      return newColors;
    });
  };

  return (
    <FormControl sx={{ marginLeft: 1, minWidth: 140 }} size="small" disabled={colorType !== 'Multicolor'}>
      <InputLabel id="multiple-chip-label">Colors</InputLabel>
      <Select
        labelId="multiple-chip-label"
        id="multiple-chip"
        multiple
        value={Object.keys(cardColors).filter(color => cardColors[color])}
        onChange={handleChange}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value) => (
              <Chip key={value} label={value} size="small" />
            ))}
          </Box>
        )}
      >
        {cardColorOptions.map((color) => (
          <MenuItem key={color} value={color}>
            {color}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default MyColorPicker;
