import * as React from 'react';
import { Stack, CardContent, Box, LinearProgress, Typography } from '@mui/material';

export default function LoadingCollectionInfo() {
  return (
    <CardContent mt={2}>
      <Stack spacing={2}>
        <Typography variant="body2" textAlign={'center'}>
          Loading NFT Collection Information...
        </Typography>
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>
      </Stack>
    </CardContent>
  );
}
