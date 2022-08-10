import * as React from 'react';
import { Typography, Button } from '@mui/material';
import MessageCard from './MessageCard';

export default function SoldOut({ isTestNet, collectionUrl }) {
  const openInNewTab = (url) => window.open(url, '_blank', 'noopener,noreferrer');

  return (
    <MessageCard>
      <Typography variant="body2" color="primary" align="center">
        Thank you for your support!
      </Typography>
      <Typography variant="body2" color="primary" align="center">
        Our current sale is sold out, but please come back for our next sale!
      </Typography>
      {/* LEGAL ADVISED NOT TO PROMOTE OPENSEA TRADING
      <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={() => openInNewTab(`https://${isTestNet() ? 'testnets.' : ''}${collectionUrl}`)}>
        Buy Deixa Xastro Origin on OpenSea
      </Button> 
      */}
    </MessageCard>
  );
}
