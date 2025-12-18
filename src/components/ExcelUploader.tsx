import { alpha, Box, Typography, useTheme } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from '../store/zustand';
import parseTimeData, { MonthGroup } from '../utils/parseTimeData';

interface ExcelUploaderProps {
  onDataParsed: (data: MonthGroup[]) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export default function ExcelUploader({ onDataParsed, setIsLoading }: ExcelUploaderProps) {
  const theme = useTheme();
  const endDate = useStore((s) => s.endDate);
  const weekends = useStore((s) => s.weekends);
  const workdayHours = useStore((s) => s.workdayHours);
  const smtoLimitOption = useStore((s) => s.smtoLimitOption);
  const smtoAnnualLimitHours = useStore((s) => s.smtoAnnualLimitHours);

  const [latestFile, setLatestFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [dragValidFile, setDragValidFile] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use ref to track if initial file has been processed
  const isInitialMount = useRef(true);

  // Re-parse file when endDate changes (but not on initial mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (!latestFile) return;

    const store = { endDate, weekends, workdayHours, smtoLimitOption, smtoAnnualLimitHours };

    const reparse = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data: MonthGroup[] = await parseTimeData(latestFile, store);
        onDataParsed(data);
      } catch (err) {
        console.error('Failed to parse file:', err);
        setError(err instanceof Error ? err.message : 'Failed to parse file');
      } finally {
        setIsLoading(false);
      }
    };

    reparse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endDate]);

  const processFile = async (file: File) => {
    const store = { endDate, weekends, workdayHours, smtoLimitOption, smtoAnnualLimitHours };
    try {
      setError(null);
      setIsLoading(true);
      const data: MonthGroup[] = await parseTimeData(file, store);
      setLatestFile(file);
      onDataParsed(data);
    } catch (err) {
      console.error('Failed to parse file:', err);
      setError(err instanceof Error ? err.message : 'Failed to parse file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(true);
    const items = event.dataTransfer.items;
    const isExcel = Array.from(items).some((item) => {
      const type = item.type;
      const name = item.getAsFile()?.name || '';
      return (
        type === 'application/vnd.ms-excel' ||
        type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        name.endsWith('.xls') ||
        name.endsWith('.xlsx')
      );
    });

    if (isExcel) {
      setDragValidFile(true);
    } else {
      console.warn('Unsupported file type dragged.');
      setDragValidFile(false);
    }
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  let borderColor = 'grey.400';
  let bgcolor = alpha(theme.palette.divider, 0.025);
  if (dragActive && dragValidFile) {
    borderColor = 'success.main';
    bgcolor = alpha(theme.palette.success.main, 0.1);
  }
  if (dragActive && !dragValidFile) {
    borderColor = 'error.main';
    bgcolor = alpha(theme.palette.error.main, 0.1);
  }

  return (
    <Box
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      sx={{
        borderRadius: theme.spacing(2),
        border: '2px dashed',
        borderColor,
        textAlign: 'center',
        bgcolor,
        cursor: dragActive && !dragValidFile ? 'not-allowed' : 'pointer',
        minHeight: 200,
        minWidth: 500,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onClick={() => document.getElementById('file-input')?.click()}
    >
      {dragActive && dragValidFile && (
        <>
          <Typography component="p" variant="h5" mb={2} sx={{ color: theme.palette.success.main }}>
            Valid file type
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.success.main }}>
            Drop file to being parsing
          </Typography>
        </>
      )}
      {dragActive && !dragValidFile && (
        <>
          <Typography component="p" variant="h5" mb={2} sx={{ color: theme.palette.error.main }}>
            Invalid file type
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.error.main }}>
            Only .xls/.xlsx files are supported
          </Typography>
        </>
      )}
      {!dragActive && !error && (
        <>
          <Typography component="p" variant="h5" mb={2}>
            Drag and Drop your .xls/.xlsx file here
          </Typography>
          <Typography variant="body2">or click to select a file</Typography>
        </>
      )}
      {!dragActive && error && (
        <>
          <Typography component="p" variant="h5" mb={2} sx={{ color: theme.palette.error.main }}>
            Error parsing file
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.error.main }}>
            {error}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Click to try another file
          </Typography>
        </>
      )}
      <input id="file-input" type="file" accept=".xls,.xlsx" hidden onChange={handleFileInput} />
    </Box>
  );
}
