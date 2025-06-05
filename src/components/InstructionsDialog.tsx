import InfoIcon from '@mui/icons-material/Info';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import * as React from 'react';
import MdxInstructions from '../content/instructions.mdx';
import mdxComponents from '../utils/mdxComponents';

export default function InstructionsDialog() {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Tooltip title="Upload BigTime report data">
        <IconButton color="inherit" onClick={handleOpen}>
          <InfoIcon />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="instructions-dialog-title"
        aria-describedby="instructions-dialog-description"
      >
        <DialogTitle id="instructions-dialog-title">Instructions</DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <MdxInstructions components={mdxComponents} />
        </DialogContent>
        <DialogActions sx={{ pb: 2, px: 3 }}>
          <Button onClick={handleClose} color="error" variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
