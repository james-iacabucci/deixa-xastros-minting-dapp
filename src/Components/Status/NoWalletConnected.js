import { Button, CardActions, CardContent, Typography } from '@mui/material';
import * as React from 'react';

export default function NoWalletConnected({ signIn }) {
  return (
    <>
      <CardContent mt={2}>
        <Typography variant="body2" align="center">
          Please connect your Ethereum wallet to continue.
        </Typography>
      </CardContent>
      <CardActions>
        <Button fullWidth sx={{ color: 'white' }} variant="contained" onClick={() => signIn('metamask')}>
          Metamask
        </Button>
        <Button fullWidth sx={{ color: 'white' }} variant="contained" onClick={() => signIn('walletconnect')}>
          WalletConnect
        </Button>
      </CardActions>
      <CardActions>
        <Button fullWidth sx={{ color: 'white' }} variant="contained" onClick={() => signIn('web3Auth')}>
          Create Deixa Wallet
        </Button>
      </CardActions>
    </>
  );
}
