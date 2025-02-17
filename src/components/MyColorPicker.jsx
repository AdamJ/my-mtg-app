import * as React from 'react';
import PropTypes from 'prop-types';
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

  MyColorPicker.propTypes = {  // Define prop types
    cardColors: PropTypes.object.isRequired, // cardColors should be an object and is required
    setCardColors: PropTypes.func.isRequired, // setCardColors should be a function and is required
    colorType: PropTypes.string.isRequired, // colorType should be a string and is required
  };

  return (
    <FormControl sx={{ marginLeft: 1, minWidth: 100 }} size="small" fullWidth disabled={colorType !== 'Multicolor'}>
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
