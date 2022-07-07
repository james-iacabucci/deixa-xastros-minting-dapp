

/*
// STAKING FUNCTIONS

  async function stake(tokenIds) {
    try {
      const isApprovedForAll = await Moralis.executeFunction({...nftContractOptions, params: { owner: account, operator: stakingContractOptions.contractAddress }, functionName: 'isApprovedForAll' });
      console.log('Approved Already?', isApprovedForAll, account);
      
      if (!isApprovedForAll) {
        const approveTx = await Moralis.executeFunction({...nftContractOptions, params: { operator: stakingContractOptions.contractAddress, approved: true }, functionName: 'setApprovalForAll' });
        await approveTx.wait();      
      }
      const tx = await Moralis.executeFunction({...stakingContractOptions, params: { tokenIds: tokenIds }, functionName: 'stake' });   
      console.log("TRANSACTION...", tx);
      setProcessing(true);
      await tx.wait();
      setProcessing(false);
    } catch (e) {
      setError(e.code);
    }
  }

  async function unstake(tokenIds) {
    try {
      const tx = await Moralis.executeFunction({...stakingContractOptions, params: { tokenIds: tokenIds }, functionName: 'unstake' });    
      setProcessing(true);
      await tx.wait();
      setProcessing(false);
    } catch (e) {
      setError(e.code);
    }
  }

  async function claim(tokenIds) {
    try {
      const tx = await Moralis.executeFunction({...stakingContractOptions, params: { tokenIds: tokenIds }, functionName: 'claim' });    
      setProcessing(true);
      await tx.wait();
      setProcessing(false);
    } catch (e) {
      setError(e);
    }
  }

  async function earnings(tokenIds) {
    try {
      const earnings = await Moralis.executeFunction({...stakingContractOptions, params: { tokenIds: tokenIds }, functionName: 'earningInfo' });    
      setValues(prevValues => ({ ...prevValues, earnings: earnings }));
    } catch (e) {
      setError(e);
    }
  }
*/

{/*           {isAuthenticated && 
            <Card sx={{
              position: "relative",
              display: "flex",
              padding: '1em',
              flexDirection: "row",
              justifyContent: "space-between",
              opacity: 0.9,
              alignItems: "center"}}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}><Button fullWidth variant='contained' disabled={values.isMintingPaused} onClick={() => mintTokens(1)}>Buy</Button></Grid>
                <Grid item xs={4}><Button fullWidth variant='contained' disabled={isNothingOwned || values.isStakingPaused} onClick={() => stake([values.nftWallet[0].toNumber()])}>Stake First</Button></Grid>
                <Grid item xs={4}><Button fullWidth variant='contained' disabled={isNothingOwned || values.isStakingPaused} onClick={() => stake(values.nftWallet)}>Stake All</Button></Grid>
                <Grid item xs={4}><Button fullWidth variant='contained' disabled={isNothingStaked} onClick={() => unstake([values.stakingWallet[0].toNumber()])}>UnStake First</Button></Grid>
                <Grid item xs={4}><Button fullWidth variant='contained' disabled={isNothingStaked} onClick={() => unstake(values.stakingWallet)}>UnStake All</Button></Grid>
                <Grid item xs={4}><Button fullWidth variant='contained' disabled={isNothingStaked} onClick={() => claim(values.stakingWallet)}>Claim Earnings</Button></Grid>
                <Grid item xs={4}><Button fullWidth variant='contained' disabled={isNothingStaked} onClick={() => earnings(values.stakingWallet)}>Get Earnings</Button></Grid>
              </Grid>
            </Card>
          }
 */}  


          {/*   <Typography>{`Staking Status : ${values.isStakingPaused ? "Staking Paused" : "Staking Open"}`}</Typography>
                <Typography>{`Staking Wallet: ${values.stakingWallet?.length ? values.stakingWallet?.join(',') : 'empty'}`}</Typography>
                <Typography>{`Blooms Earned: ${values.earnings}`}</Typography>
          */}   