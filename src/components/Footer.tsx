import Typography from '@mui/material/Typography';
import pkg from '../../package.json';

export default function Copyright() {
  return (
    <Typography
      variant="body2"
      align="center"
      sx={{
        color: 'text.secondary',
        m: 4,
      }}
    >
      v{pkg.version}
    </Typography>
  );
}
