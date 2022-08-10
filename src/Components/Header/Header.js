import * as React from 'react';

import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';

import { MenuOutlined } from '@mui/icons-material';
import { IconButton, Typography } from '@mui/material';
import { useState } from 'react';
import { useChain, useMoralis } from 'react-moralis';
import logo from '../../Assets/Logos/DeixaFlat.png';
import AppConfig from '../../Config/AppConfig';

export default function Header({ values, userWallet, signOut, setError, isTestNet, processing, setProcessing, nftContractOptions, viewMyAssets, buyEth }) {
  const { isAuthenticated, Moralis, account } = useMoralis();
  const { chain } = useChain();

  function openInNewTab(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  async function setCollectionPaused(newState) {
    try {
      const tx = await Moralis.executeFunction({ ...nftContractOptions, params: { _state: newState }, functionName: 'setPaused' });
      setProcessing(true);
      await tx.wait();
      setProcessing(false);
      window.location.reload();
    } catch (e) {
      console.error(e);
      setError(e);
      setProcessing(false);
    }
  }

  async function withdrawFunds() {
    try {
      const tx = await Moralis.executeFunction({ ...nftContractOptions, functionName: 'withdraw' });
      setProcessing(true);
      await tx.wait();
      setProcessing(false);
      window.location.reload();
    } catch (e) {
      console.error(e);
      setError(e);
      setProcessing(false);
    }
  }

  const [anchorEl, setAnchorEl] = useState();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <AppBar position="fixed" elevation={2} sx={{ backgroundColor: 'black' }}>
        <Toolbar>
          <Link sx={{ cursor: 'pointer' }} onClick={() => openInNewTab('https://deixa.io')}>
            <img src={logo} alt="logo" style={{ width: '125px' }} />
          </Link>
          {account && isAuthenticated && (
            <Stack spacing={1} direction="row" alignItems={'center'} sx={{ marginLeft: 'auto' }}>
              {AppConfig.isMyAssetsEnabled && <Chip variant="outlined" color="primary" label="My Assets" sx={{ display: { xs: 'none', md: 'flex' } }} onClick={() => viewMyAssets(true)} />}
              {AppConfig.isFiatEnabled && <Chip variant="outlined" color="primary" label="Buy ETH" sx={{ display: { xs: 'none', md: 'flex' } }} onClick={() => buyEth(true)} />}
              <Chip variant="outlined" color="primary" label={chain?.name} sx={{ display: { xs: 'none', md: 'flex' } }} />
              <Tooltip title={account ? account : '...'}>
                <Chip
                  variant="outlined"
                  color="primary"
                  label={`${account?.substring(0, 4).toUpperCase()}....${account?.slice(-4).toUpperCase()}`}
                  sx={{ display: { xs: 'none', md: 'flex' } }}
                  onClick={() => navigator.clipboard.writeText(account)}
                />
              </Tooltip>
              <Chip variant="outlined" color="primary" label={userWallet?.formatted} sx={{ display: { xs: 'none', md: 'flex', motionDistance: 'flex' } }} />
              {isAuthenticated && (
                <Button variant="contained" size="small" onClick={() => signOut()} sx={{ display: { xs: 'none', md: 'flex' } }}>
                  Disconnect
                </Button>
              )}

              <IconButton
                onClick={handleClick}
                size="small"
                color="primary"
                sx={{ display: { xs: 'flex', md: 'none' } }}
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
              >
                <MenuOutlined />
              </IconButton>
            </Stack>
          )}
        </Toolbar>
      </AppBar>

      {!processing && isAuthenticated && account && values.ownerAddress === values.userAddress && (
        <AppBar position="fixed" elevation={2} sx={{ top: 'auto', bottom: 0, backgroundColor: 'white' }}>
          <Toolbar sx={{ backgroundColor: 'white' }}>
            <Stack spacing={1} direction="row">
              <Button size="small" variant="contained" sx={{ color: 'white' }} onClick={() => setCollectionPaused(values.isMintingPaused ? false : true)}>
                {values.isMintingPaused ? 'Resume Minting' : 'Pause Minting'}
              </Button>
              <Button size="small" variant="contained" sx={{ color: 'white' }} onClick={() => withdrawFunds()}>
                Withdraw Funds
              </Button>
              <Button
                size="small"
                variant="contained"
                sx={{ color: 'white' }}
                onClick={() => openInNewTab(`https://${isTestNet() ? `${AppConfig.supportChainName.toLowerCase()}.` : ''}etherscan.io/address/${nftContractOptions.contractAddress}`)}
              >
                View Contract
              </Button>
              {/* <Button size='small' variant='contained' sx={{ color: 'white'}} onClick={() => setStakingPaused((values.isStakingPaused ? false : true))}>{values.isStakingPaused ? "Resume Staking" : "Pause Staking"}</Button> */}
            </Stack>
          </Toolbar>
        </AppBar>
      )}

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => navigator.clipboard.writeText(account)}>
          <Typography variant="subtitle1" color="primary">
            Address: {`${account?.substring(0, 4).toUpperCase()}....${account?.slice(-4).toUpperCase()}`}
          </Typography>
        </MenuItem>
        <MenuItem>{userWallet?.formatted}</MenuItem>
        <MenuItem>{chain?.name}</MenuItem>
        {AppConfig.isFiatEnabled && (
          <MenuItem onClick={() => buyEth(true)}>
            <Typography variant="subtitle1" color="primary">
              Buy ETH
            </Typography>
          </MenuItem>
        )}
        {AppConfig.isMyAssetsEnabled && (
          <MenuItem onClick={() => viewMyAssets(true)}>
            <Typography variant="subtitle1" color="primary">
              My Assets
            </Typography>
          </MenuItem>
        )}
        {isAuthenticated && <Divider />}
        {isAuthenticated && (
          <MenuItem onClick={() => signOut()}>
            <Typography variant="subtitle1" color="primary">
              Disconnect
            </Typography>
          </MenuItem>
        )}
      </Menu>
    </React.Fragment>
  );
}
