import * as React from 'react';
import { Stack, CardContent, Typography, Chip, Button, Box, LinearProgress } from '@mui/material';

export default function TransactionProcessing({ transaction, isTestNet }) {
  const openInNewTab = (url) => window.open(url, '_blank', 'noopener,noreferrer');

  return (
    <CardContent mt={2}>
      <Stack spacing={2}>
        <Typography variant="h5" color="primary" fontWeight="bold" align="center">
          Processing Your Transaction
        </Typography>
        <Typography variant="body2" textAlign={'center'}>
          Your transaction has been submitted to the Ethereum Network and is waiting to be confirmed!
        </Typography>
        <Typography variant="body2" textAlign={'center'}>
          Your screen will automatically be refreshed when the transaction is completed. This may take up to 5 minutes to complete, so please be patient.
        </Typography>
        <Chip sx={{ fontSize: 9 }} label={transaction} />
        <Button variant="contained" sx={{ color: 'white' }} fullWidth size="small" onClick={() => openInNewTab(`https://${isTestNet() ? 'rinkeby.' : ''}etherscan.io/tx/${transaction}`)}>
          View your transaction on EtherScan
        </Button>
        <Box mt={2} sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>
      </Stack>
    </CardContent>
  );
}
