import * as React from 'react';
import { Stack, CardContent, Typography, Button, Chip } from '@mui/material';
import ConfettiExplosion from 'react-confetti-explosion';

export default function TransactionComplete({ transaction, acknowledge, isTestNet }) {
  const openInNewTab = (url) => window.open(url, '_blank', 'noopener,noreferrer');

  return (
    <CardContent mt={2} sx={{ overflow: 'visible' }}>
      <ConfettiExplosion />
      <Stack spacing={2}>
        <Typography variant="h5" color="primary" fontWeight="bold" align="center">
          Congratulations!
        </Typography>
        <Typography variant="body2" textAlign={'center'}>
          You transaction has been confirmed!
        </Typography>
        <Chip variant="outlined" sx={{ fontSize: 9 }} label={transaction} />
        <Button variant="outlined" fullWidth size="small" onClick={() => openInNewTab(`https://${isTestNet() ? 'rinkeby.' : ''}etherscan.io/tx/${transaction}`)}>
          View your transaction on EtherScan
        </Button>
        <Button fullWidth sx={{ color: 'white' }} variant="contained" onClick={() => acknowledge()}>
          OK
        </Button>
      </Stack>
    </CardContent>
  );
}
