import * as React from 'react';
import { Typography } from '@mui/material';
import MessageCard from './MessageCard';

export default function WrongNetwork({ network }) {
  return (
    <MessageCard>
      <Typography variant="body2" color="orange" align="center">
        {`You are not connected to the ${network}`}
      </Typography>
      <Typography variant="body2" color="orange" align="center">
        Please connect to continue...
      </Typography>
    </MessageCard>
  );
}
