import { Button, CardActions, CardContent, Stack, Typography } from '@mui/material';
import * as React from 'react';
import { useMoralis } from 'react-moralis';

export default function SomethingWentWrong({ error, setError }) {
  const { account, Moralis } = useMoralis();

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

  const onBuyETHClick = async () => {
    let response = await Moralis.Plugins.fiat.buy(
      {
        coin: 'ETH',
        receiver: account,
      },
      {
        disableTriggers: true,
      },
    );
    window.open(response.data, '_blank');
  };

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
              await onBuyETHClick();
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
