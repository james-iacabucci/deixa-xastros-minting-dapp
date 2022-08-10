import * as React from 'react';
import { CardContent, Typography, Button, Grid, ButtonGroup } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useMoralis } from 'react-moralis';

export default function MintingControls({ values, mintAmount, setMintAmount, mintNFT }) {
  const { Moralis } = useMoralis();
  const incrementMintAmount = () => setMintAmount(Math.min(values.maxMintAmountPerTx, mintAmount + 1));
  const decrementMintAmount = () => setMintAmount(Math.max(1, mintAmount - 1));
  const mintCost = () => Moralis.Units.FromWei(values.tokenPrice, 18) * mintAmount;

  return (
    <CardContent sx={{ marginTop: '8px' }}>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <ButtonGroup variant="contained">
            <Button variant="contained" sx={{ color: 'white' }} fullWidth onClick={() => decrementMintAmount()}>
              -
            </Button>
            <Button variant="contained" sx={{ color: 'white' }} fullWidth>{`${mintAmount}`}</Button>
            <Button variant="contained" sx={{ color: 'white' }} fullWidth onClick={() => incrementMintAmount()}>
              +
            </Button>
          </ButtonGroup>
        </Grid>
        <Grid item xs={4}>
          <Typography mt={0.5} variant="body2" align="center" fontSize={'1rem'} fontWeight={'bold'} color="primary">
            {`${mintCost().toFixed(3)} ETH`}
          </Typography>
          <Typography mt={-0.5} align="center" fontSize={10}>
            (plus gas)
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Button fullWidth variant="contained" sx={{ color: 'white' }} onClick={() => mintNFT(mintAmount)} endIcon={<ArrowForwardIcon />}>
            Mint
          </Button>
        </Grid>
      </Grid>
    </CardContent>
  );
}
