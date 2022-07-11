import * as React from 'react';
import { Stack, CardContent, Typography } from '@mui/material';

export default function NoContractFound() {
  return (
    <CardContent mt={2}>
      <Stack spacing={2}>
        <Typography variant="body2" textAlign={'center'}>
          Something went wrong!
        </Typography>
        <Typography variant="body2" textAlign={'center'}>
          The NFT smart contract could not be found.
        </Typography>
        <Typography variant="body2" textAlign={'center'}>
          Please make sure your wallet is connected to the Ethereum MainNet.
        </Typography>
      </Stack>
    </CardContent>
  );
}
