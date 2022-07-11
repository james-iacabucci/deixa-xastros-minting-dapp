import * as React from 'react';
import { Typography } from '@mui/material';
import MessageCard from './MessageCard';

export default function SaleClosed() {
  return (
    <MessageCard>
      <Typography variant="body2" color="primary" align="center">
        This sale is closed. Please come back for our next sale!
      </Typography>
    </MessageCard>
  );
}
