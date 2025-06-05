import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import * as React from 'react';
import { useEffect } from 'react';
import { MonthGroup } from '../utils/parseTimeData';
import ExcelUploader from './ExcelUploader';

export default function UploadDialog({
  handleSetData,
  setIsLoading,
  isLoading,
}: {
  handleSetData: (data: MonthGroup[]) => void;
  setIsLoading: (data: boolean) => void;
  isLoading: boolean;
}) {
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (isLoading) {
      setOpen(false);
    }
  }, [isLoading]);

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
          <CloudUploadIcon />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="upload-dialog-title"
        aria-describedby="upload-dialog-description"
      >
        <DialogTitle id="upload-dialog-title">Upload BigTime Report Data</DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <ExcelUploader onDataParsed={handleSetData} setIsLoading={setIsLoading} />
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
