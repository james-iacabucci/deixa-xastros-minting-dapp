import { Button, Card, CardContent, CardMedia, DialogActions, Grid, Typography } from '@mui/material';
import * as React from 'react';
import Background from '../../Assets/background3.png';
import AppConfig from '../../Config/AppConfig';
import StringUtils from '../Utils/StringUtils';

export default function Nft({ nft, metadata }) {
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = Background;
  };
  return (
    <Card elevation={8} sx={{ border: 3, borderColor: 'white', overflow: 'visible' }}>
      <CardMedia
        component="img"
        image={metadata ? StringUtils.convertIpfsUriToIpfsUrl(metadata.image) : Background}
        sx={{ bgcolor: 'black', py: 2, borderRadius: '4px 4px 0 0' }}
        onError={handleImageError}
      />
      <CardContent mt={2}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body1" color="primary">
              {metadata ? metadata.name : `${nft.name} #${nft.token_id}`}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2">{metadata ? metadata.description : nft.token_id}</Typography>
          </Grid>
        </Grid>
      </CardContent>
      <DialogActions style={{ justifyContent: 'center' }}>
        <Button
          onClick={() =>
            window.open(
              `https://${!AppConfig.isMainnet ? `${AppConfig.supportChainName.toLowerCase()}.` : ''}etherscan.io/token/${nft.token_address}?a=${nft.token_id}`,
              '_blank',
              'noopener,noreferrer',
            )
          }
          color="primary"
        >
          View on Etherscan
        </Button>
      </DialogActions>
    </Card>
  );
}
