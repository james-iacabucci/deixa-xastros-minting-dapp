import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';
import AppConfig from '../../Config/AppConfig';
import CollectionConfig from '../../Config/CollectionConfig';
import Nft from '../Nft';

export default function MyAssets() {
  const { isAuthenticated, account, Moralis } = useMoralis();
  const [nfts, setNfts] = useState();

  useEffect(() => {
    async function fetchNfts() {
      try {
        const response = await Moralis.Web3API.account.getNFTsForContract({
          chain: AppConfig.supportChainId,
          address: account,
          token_address: CollectionConfig.contractAddress,
        });
        if (response) {
          setNfts(response.result);
        } else {
          setNfts([]);
        }
      } catch (e) {
        setNfts([]);
      }
    }
    fetchNfts();
  }, [isAuthenticated, account, Moralis.Web3API.account]);

  return nfts ? (
    nfts.length > 0 ? (
      <Grid container spacing={4}>
        {nfts.map((nft) => (
          <Grid key={nft.token_id} item md={3} xs={12}>
            <Nft nft={nft} metadata={nft.metadata && JSON.parse(nft.metadata)} />
          </Grid>
        ))}
      </Grid>
    ) : (
      <Box display="flex" alignItems="center" justifyContent="center" mt={3}>
        <Typography variant="body1">Don't have any NFTs</Typography>
      </Box>
    )
  ) : (
    <Box display="flex" alignItems="center" justifyContent="center" mt={3}>
      <CircularProgress />
    </Box>
  );
}
