import * as React from 'react';
import Icon from '@mui/material/Icon';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const manaIcon = createTheme({
  components: {
    MuiIcon: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
          color: "#f19b79",
        }
      },
      defaultProps: {
        // Replace the `material-icons` default value.
        baseClassName: 'ms',
      },
    },
  },
});

export default function MountainIcon() {

  return (
    <ThemeProvider theme={manaIcon}>
      <Icon
        className="ms-m"
      />
    </ThemeProvider>
  );
}
