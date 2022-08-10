import { Button, CardActions, CardContent, Stack, Typography } from '@mui/material';
import * as React from 'react';

export default function SomethingWentWrong({ error, setError, onBuyEth }) {
  function formatErrorMessage(error) {
    if (error.message.includes('This is an invalid')) return 'Your wallet address is not on the approved list.';
    if (error.message.includes('Your address has already claimed')) return `Your wallet address has already claimed an NFT for this stage of the sale.`;
    if (error.message.includes('This purchase exceeds')) return 'Your purchase cannot be completed. It exceeds the maximum number of NFTs for this sale.';

    switch (error.code) {
      case 'INSUFFICIENT_FUNDS':
        return 'Your wallet does not have enough ETH to complete this purchase.';
      case 4001:
        return 'This transaction has been canceled at your request.';
      case 32603:
        return error.message;
      default:
        return `An error has occurred while processing your transaction (${error.message})`;
    }
  }

  return (
    <>
      <CardContent mt={2}>
        <Stack spacing={2}>
          <Typography variant="h5" color="primary" fontWeight="bold" align="center">
            Something Went Wrong!
          </Typography>
          <Typography variant="body2" align="center">
            {formatErrorMessage(error)}
          </Typography>
        </Stack>
      </CardContent>
      <CardActions>
        {error.code === 'INSUFFICIENT_FUNDS' ? (
          <Button
            fullWidth
            sx={{ color: 'white' }}
            variant="contained"
            onClick={async () => {
              onBuyEth();
              setError(null);
            }}
          >
            Buy ETH
          </Button>
        ) : (
          <Button fullWidth sx={{ color: 'white' }} variant="contained" onClick={() => setError(null)}>
            OK
          </Button>
        )}
      </CardActions>
    </>
  );
}
