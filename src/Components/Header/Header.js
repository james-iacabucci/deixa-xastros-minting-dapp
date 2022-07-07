import * as React from 'react';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';

import { useMoralis, useChain } from "react-moralis";
import logo from "../../assets/Logos/SB_Simple_White.png";
import CollectionConfig from '../../Config/CollectionConfig';

export default function Header({values, userWallet, signOut, setError, isTestNet, processing, setProcessing, nftContractOptions, stakingContractOptions}) {
  
  const { isAuthenticated, Moralis, account } = useMoralis();
  const { chain } = useChain();

  function openInNewTab(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  async function setCollectionPaused(newState) {
    try {
      const tx = await Moralis.executeFunction({...nftContractOptions, params: { _state: newState }, functionName: 'setPaused' }); 
      setProcessing(true);
      await tx.wait();
      setProcessing(false);
      window.location.reload();
    } catch (e) {
      console.error(e)
      setError(e);
      setProcessing(false);
    }
  }

  async function withdrawFunds() {
    try {
      const tx = await Moralis.executeFunction({...nftContractOptions, functionName: 'withdraw' }); 
      setProcessing(true);
      await tx.wait();
      setProcessing(false);
      window.location.reload();
    } catch (e) {
      console.error(e)
      setError(e);
      setProcessing(false);
    }
  }

  async function setStakingPaused(newState) {
    try {
      const tx = await Moralis.executeFunction({...stakingContractOptions, params: { _state: newState }, functionName: 'setPaused' }); 
      setProcessing(true);
      await tx.wait();
      setProcessing(false);
      window.location.reload();
    } catch (e) {
      console.error(e)
      setError(e);
      setProcessing(false);
    }
  }
  
  return (
    <>
      <AppBar position="fixed" elevation={2} sx={{ backgroundColor : 'black'}}>
        <Toolbar>
          <Link sx={{ cursor: 'pointer' }} onClick={() => openInNewTab("https://shebloomsnft.io")}>
            <img src={logo} alt="logo" style={{width: "200px"}}/>
          </Link>
          {account && isAuthenticated && 
            <Stack spacing={1} direction="row" alignItems={"center"} sx={{ marginLeft: "auto"}}>
              <Chip variant="outlined" color="primary" label={chain?.name} sx={{ display: { xs: 'none', md: 'flex'}}}/>
              <Tooltip title={account ? account : "..."}>
                <Chip variant="outlined" color="primary" label={`${account?.substring(0,4).toUpperCase()}....${account?.slice(-4).toUpperCase()}`} sx={{ display: { xs: 'none', sm: 'flex' }}}/>
              </Tooltip>
              <Chip variant="outlined" color="primary" label={userWallet?.formatted} sx={{ display: { xs: 'none', sm: 'flex' }}} />
              {isAuthenticated && <Button variant="contained" size="small" onClick={() => signOut()} >Disconnect</Button>}
            </Stack>
          }
        </Toolbar>
      </AppBar> 


      {!processing && isAuthenticated && account && (values.ownerAddress === values.userAddress) && 
        <AppBar position="fixed" elevation={2} sx={{ top: 'auto', bottom: 0, backgroundColor : 'white'}}>
          <Toolbar sx={{ backgroundColor: 'white'}}>  
            <Stack spacing={1} direction="row">  
              <Button size='small' variant='contained' sx={{ color: 'white'}} onClick={() => setCollectionPaused((values.isMintingPaused ? false : true))}>{values.isMintingPaused ? "Resume Minting" : "Pause Minting"}</Button>
              <Button size='small' variant='contained' sx={{ color: 'white'}} onClick={() => withdrawFunds()}>Withdraw Funds</Button>
              <Button size='small' variant='contained' sx={{ color: 'white'}} onClick={() => openInNewTab(`https://${isTestNet() ? "rinkeby." : ""}etherscan.io/address/${nftContractOptions.contractAddress}`)}>View Contract</Button>
              {/* <Button size='small' variant='contained' sx={{ color: 'white'}} onClick={() => setStakingPaused((values.isStakingPaused ? false : true))}>{values.isStakingPaused ? "Resume Staking" : "Pause Staking"}</Button> */}
            </Stack>
          </Toolbar> 
        </AppBar>
      }

    </>

  );
}
