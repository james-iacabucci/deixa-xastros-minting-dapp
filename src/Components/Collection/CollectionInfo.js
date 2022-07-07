import * as React from 'react';
import { Typography, Grid } from '@mui/material';

export default function CollectionInfo({values}) {

  return (
    <Grid container spacing={2}>

      <Grid item xs={6}>
        <Typography variant="body2">
          Sale Type
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="body2" align="right" color="primary">
          {`${values.saleStage} ${ !values.isReleased ? "(Test)" : "" }`}
        </Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography variant="body2">
          Sale Status
        </Typography>
        </Grid>
      <Grid item xs={6}>
        <Typography variant="body2" align="right" color="primary" >
         {(values.maxSupply === values.totalSupply) 
            ? "Sold Out" 
            : values.isMintingPaused 
              ? "Closed" 
              : !(values.isFreelistMintEnabled || values.isGoldlistMintEnabled) 
                ? "Open" 
                : (values.isFreelistMintEnabled && values.isUserInFreelist) || (values.isGoldlistMintEnabled && values.isUserInGoldlist) 
                  ? "Approved" 
                  : "Not Approved"
         }
        </Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography variant="body2" >
          Minting Status
        </Typography>
        </Grid>
      <Grid item xs={6}>
        <Typography variant="body2" align="right" color="primary">
          {`${values.totalSupply} of ${values.maxSupply}`}
        </Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography variant="body2" >
          She Blooms Owned
        </Typography>
        </Grid>
      <Grid item xs={6}>
        <Typography variant="body2" align="right" color="primary">
          {values.nftWallet?.length ? '#' + values.nftWallet?.join(', #') : 'Your Wallet is Empty'}
        </Typography>
      </Grid>

    </Grid>
    );
}
