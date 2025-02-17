import * as React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const MyAlert = () => {
  const [setOpen] = React.useState(true);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false); // For optional snackbar feedback
  const [acknowledged, setAcknowledged] = React.useState(localStorage.getItem('scryfallAlertAcknowledged') === 'true');

  const handleClose = () => {
    setOpen(false);
  };

  const handleOkay = () => {
    setAcknowledged(true);
    localStorage.setItem('scryfallAlertAcknowledged', 'true'); // Store acknowledgment in local storage
    setOpen(false);
    setSnackbarOpen(true); // Optional: Show a snackbar confirmation
  };

    const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  if (acknowledged) {
    return null; // Don't render the alert if already acknowledged
  }

  return (
    <>
      <Alert
        sx={{ marginBottom: 2 }}
        severity="info"
        onClose={handleClose} // Allow closing with the 'x'
        action={
          <Button color="inherit" size="small" onClick={handleOkay}>
            Okay
          </Button>
        }
      >
        <AlertTitle>Heads Up!</AlertTitle>
        Scryfall integrations are a work in progress. If the Card Type or Color is
        incorrect, you may change it before adding the card to your deck list.
      </Alert>

      {/* Optional Snackbar feedback */}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <MuiAlert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Acknowledgment saved!
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default MyAlert;
