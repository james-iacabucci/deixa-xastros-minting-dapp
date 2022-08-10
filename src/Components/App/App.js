// REACT LIBRARIES
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

// UI LIBRARIES
import { Box, Button, Card, CardMedia, Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Link, Stack, Typography } from '@mui/material';

// WEB3 LIBRARIES
import { BigNumber } from 'ethers';
import { useChain, useMoralis, useNativeBalance } from 'react-moralis';

// DAPP ASSETS
import background from '../../Assets/background4.png';
import XastroLogo from '../../Assets/Logos/Xastro.png';
import CollectionConfig from '../../Config/CollectionConfig';
import Freelist from '../Utils/Freelist';
import Goldlist from '../Utils/Goldlist';
import Header from './../Header/Header';

// DAPP COMPONENTS
import { CloseOutlined } from '@mui/icons-material';
import logo from '../../Assets/Logos/DeixaFlat.png';
import AppConfig from '../../Config/AppConfig';
import CollectionInfo from '../CollectionInfo/CollectionInfo';
import MintingControls from '../MintingControls/MintingControls';
import MyAssets from '../MyAssets';
import Onramper from '../Onramper';
import LoadingCollectionInfo from '../Status/LoadingCollectionInfo';
import NoContractFond from '../Status/NoContractFound';
import NoWalletConnected from '../Status/NoWalletConnected';
import ProcessingTransaction from '../Status/ProcessingTransaction';
import SaleClosed from '../Status/SaleClosed';
import SoldOut from '../Status/SoldOut';
import SomethingWentWrong from '../Status/SomethingWentWrong';
import TransactionComplete from '../Status/TransactionComplete';
import WrongNetwork from '../Status/WrongNetwork';

const nftContractAbi = require('../../Config/DeixaXastroCollection.json').abi;

const defaultState = {
  userAddress: null,
  userBalance: 0,
  ownerAddress: null,
  network: null,
  networkConfig: null,
  totalSupply: 0,
  maxSupply: 0,
  maxMintAmountPerTx: 0,
  tokenPrice: BigNumber.from(0),
  isMintingPaused: null,
  isFreelistMintEnabled: false,
  isGoldlistMintEnabled: false,
  isPreSaleMintEnabled: false,
  isUserInFreelist: false,
  isUserInGoldlist: false,
  nftWallet: [],
  isReleased: false,
  saleStage: null,
  merkleProofManualAddress: '',
  merkleProofManualAddressFeedbackMessage: null,
};

function App() {
  const [searchParam, setSearchParam] = useSearchParams();
  const [promotionCode, setPromotionCode] = useState(searchParam.get('promo'));

  const [error, setError] = useState('');
  const [mintAmount, setMintAmount] = useState(1);
  const [values, setValues] = useState(defaultState);
  const [processing, setProcessing] = useState(false);
  const [transaction, setTransaction] = useState(null);
  const [contractFound, setContractFound] = useState(false);
  const [transactionCompleted, setTransactionCompleted] = useState(false);
  const [shouldShowMyAssets, setShowMyAssets] = useState(false);
  const [shouldShowBuyEth, setShowBuyEth] = useState(false);

  const { chainId } = useChain();
  const { data: userWallet } = useNativeBalance();
  const { authenticate, logout, isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading, account, chain, Moralis } = useMoralis();

  let nftContractOptions = {
    contractAddress: CollectionConfig.contractAddress,
    abi: nftContractAbi,
    functionName: null,
    msgValue: 0,
  };

  // DEBUG WATCHERS
  useEffect(() => {
    console.log('Web3Enabled', isWeb3Enabled);
  }, [isWeb3Enabled]);

  useEffect(() => {
    console.log('Authenticated', isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    console.log('Promo Code:', promotionCode);
  }, [promotionCode]);

  useEffect(() => {
    console.log('Values:', values);
  }, [values]);

  function getProviderParam(providerId) {
    switch (providerId) {
      case 'walletconnect':
        //return { provider: providerId, chainId: parseInt(AppConfig.supportChainId, 16) };
        return { provider: providerId };
      case 'web3Auth':
        return { provider: providerId, clientId: AppConfig.web3AuthClientId, chainId: AppConfig.supportChainId, appLogo: logo };
      case 'metamask':
      default:
        return { provider: providerId };
    }
  }

  // AUTHENTICATION
  async function signIn(providerId) {
    await authenticate(getProviderParam(providerId));
    localStorage.setItem('local_provider', providerId);
  }

  async function signOut() {
    await logout();
    localStorage.removeItem('local_provider');
    setShowMyAssets(false);
    setError('');
    setValues(() => defaultState);
  }

  // INITIALIZATION
  useEffect(() => {
    async function initialize() {
      if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) {
        await enableWeb3(getProviderParam(localStorage.getItem('local_provider')));
      }
      if (isAuthenticated && isWeb3Enabled) {
        await initWallet();
      }
    }
    initialize();

    const unsubAccountChanged = Moralis.onAccountChanged(function (account) {
      console.log('Detected an Account Change:', account);
      window.location.reload();
    });

    const unsubChainChanged = Moralis.onChainChanged(function (chain) {
      console.log('Detected a Chain Change:', chain);
      window.location.reload();
    });

    return () => {
      unsubAccountChanged();
      unsubChainChanged();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled, account, chain]);

  async function initWallet() {
    console.log('Initializing Wallet...');
    setProcessing(true);
    setValues(() => defaultState);

    if (!account) {
      console.log('initWallet: account is null. exiting...');
      return;
    }

    let cost = 0;
    let owner = null;
    let maxSupply = 0;
    let totalSupply = 0;
    let nftWallet = null;
    let isReleased = false;
    let maxMintAmountPerTx = 0;
    let isMintingPaused = true;
    let isFreelistMintEnabled = false;
    let isGoldlistMintEnabled = false;
    let isPreSaleMintEnabled = false;

    // COLLECTION PROPERTIES
    try {
      owner = await Moralis.executeFunction({ ...nftContractOptions, functionName: 'owner' });
      maxSupply = (await Moralis.executeFunction({ ...nftContractOptions, functionName: 'maxSupply' }))?.toNumber();
      totalSupply = (await Moralis.executeFunction({ ...nftContractOptions, functionName: 'totalSupply' }))?.toNumber();
      maxMintAmountPerTx = (await Moralis.executeFunction({ ...nftContractOptions, functionName: 'maxMintAmountPerTx' }))?.toNumber();
      cost = await Moralis.executeFunction({ ...nftContractOptions, functionName: 'cost' });
      isMintingPaused = await Moralis.executeFunction({ ...nftContractOptions, functionName: 'paused' });
      isFreelistMintEnabled = await Moralis.executeFunction({ ...nftContractOptions, functionName: 'freeListMintEnabled' });
      isGoldlistMintEnabled = await Moralis.executeFunction({ ...nftContractOptions, functionName: 'goldListMintEnabled' });
      isPreSaleMintEnabled = await Moralis.executeFunction({ ...nftContractOptions, functionName: 'preSaleMintEnabled' });
      isReleased = await Moralis.executeFunction({ ...nftContractOptions, functionName: 'released' });
      nftWallet = await Moralis.executeFunction({ ...nftContractOptions, params: { _owner: account }, functionName: 'walletOfOwner' });
    } catch (e) {
      console.error(e);
      setContractFound(false);
      setProcessing(false);
      return;
    }

    setValues((prevValues) => ({
      ...prevValues,
      userAddress: account.toUpperCase(),
      ownerAddress: owner.toUpperCase(),
      maxSupply: maxSupply,
      totalSupply: totalSupply,
      maxMintAmountPerTx: maxMintAmountPerTx,
      tokenPrice: cost,
      isMintingPaused: isMintingPaused,
      saleStage: isFreelistMintEnabled ? 'Free List Only' : isGoldlistMintEnabled ? 'Founder List Only' : isPreSaleMintEnabled ? 'First Release' : 'Second Release',
      isFreelistMintEnabled: isFreelistMintEnabled,
      isGoldlistMintEnabled: isGoldlistMintEnabled,
      isPreSaleMintEnabled: isPreSaleMintEnabled,
      isUserInFreelist: Freelist.contains(account ?? ''),
      isUserInGoldlist: Goldlist.contains(account ?? ''),
      isReleased: isReleased,
      nftWallet: nftWallet,
    }));

    setContractFound(true);
    setProcessing(false);
  }

  // COLLECTION FUNCTIONS

  async function mintNFT(amount) {
    let tx;
    const promoCode = promotionCode ? promotionCode : 'deixa';

    try {
      values.isFreelistMintEnabled
        ? (tx = await Moralis.executeFunction({
            ...nftContractOptions,
            params: { _mintAmount: amount, _merkleProof: Freelist.getProofForAddress(account), _promotionCode: 'deixa' },
            msgValue: values.tokenPrice.mul(amount),
            functionName: 'freeListMint',
          }))
        : values.isGoldlistMintEnabled
        ? (tx = await Moralis.executeFunction({
            ...nftContractOptions,
            params: { _mintAmount: amount, _merkleProof: Goldlist.getProofForAddress(account), _promotionCode: promoCode },
            msgValue: values.tokenPrice.mul(amount),
            functionName: 'goldListMint',
          }))
        : (tx = await Moralis.executeFunction({
            ...nftContractOptions,
            params: { _mintAmount: amount, _promotionCode: promoCode },
            msgValue: values.tokenPrice.mul(amount),
            functionName: 'mint',
          }));

      setTransaction(tx.hash);
      setTransactionCompleted(false);
      setProcessing(true);
      await tx.wait();
      setProcessing(false);
      setTransactionCompleted(true);
    } catch (e) {
      console.error(e);
      setError(e);
      setProcessing(false);
    }
  }

  async function acknowledgeTransaction() {
    setTransaction(null);
    setTransactionCompleted(false);
    await initWallet();
  }

  function viewMyAssets(shouldShow) {
    setShowMyAssets(shouldShow);
  }

  function onShowBuyEth(shouldShow) {
    setShowBuyEth(shouldShow);
  }

  function openInNewTab(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  const isMainNet = () => AppConfig.isMainnet;
  const isTestNet = () => !AppConfig.isMainnet;
  const isWalletConnected = () => account !== null && isAuthenticated;
  const isSoldOut = () => values.maxSupply !== 0 && values.totalSupply >= values.maxSupply;
  const isPurchaseEnabled = () => isWalletConnected() && !isSoldOut() && !values.isMintingPaused && contractFound && ((values.isReleased && isMainNet()) || (!values.isReleased && !isMainNet()));

  const showNoWalletConnected = () => !processing && !isWalletConnected();
  const showContractNotFound = () => !processing && isWalletConnected() && !contractFound;
  const showSomethingWentWrong = () => !processing && error;
  const showLoadingCollectionInfo = () => processing && !transaction;
  const showProcessingTransaction = () => processing && transaction && !transactionCompleted;
  const showTransactionComplete = () => !processing && transactionCompleted;
  const showCollectionInfo = () => !processing && isWalletConnected() && contractFound && !error && !transactionCompleted;
  const showMintingControls = () => !processing && isPurchaseEnabled() && !error && !transactionCompleted;
  const showSaleClosed = () => !processing && values.isMintingPaused && contractFound;
  const showSoldOut = () => !processing && isSoldOut() && contractFound;
  const showNotOnMainNet = () => !processing && values.isReleased && !isMainNet();
  const showNotOnTestNet = () => !processing && !values.isReleased && isMainNet();

  return (
    <Container disableGutters maxWidth="false">
      <Header
        values={values}
        signOut={signOut}
        userWallet={userWallet}
        isTestNet={isTestNet}
        setError={setError}
        processing={processing}
        setProcessing={setProcessing}
        nftContractOptions={nftContractOptions}
        viewMyAssets={viewMyAssets}
        buyEth={onShowBuyEth}
      />
      <div
        style={{
          position: 'relative',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundImage: `url(${background})`,
        }}
      >
        <Container fixed={true} maxWidth="xs">
          <Stack spacing={2} sx={{ overflow: 'visible' }}>
            {/* MAIN COLLECTION UX */}

            <Card raised={true} elevation={20} sx={{ border: 3, borderColor: 'white', overflow: 'visible' }}>
              <Link href={`https://${isTestNet() ? `${AppConfig.supportChainName.toLowerCase()}.` : ''}etherscan.io/address/${nftContractOptions.contractAddress}`} target="_blank">
                <CardMedia component="img" image={XastroLogo} alt="DEIXA Xastro" sx={{ bgcolor: 'black', py: 2, borderRadius: '4px 4px 0 0' }} />
              </Link>

              {showNoWalletConnected() && <NoWalletConnected signIn={signIn} />}

              {showContractNotFound() && <NoContractFond />}

              {showSomethingWentWrong() && <SomethingWentWrong error={error} setError={setError} onBuyEth={() => onShowBuyEth(true)} />}

              {showLoadingCollectionInfo() && <LoadingCollectionInfo />}

              {showProcessingTransaction() && <ProcessingTransaction transaction={transaction} isTestNet={isTestNet} />}

              {showTransactionComplete() && <TransactionComplete transaction={transaction} acknowledge={acknowledgeTransaction} isTestNet={isTestNet} />}

              {showCollectionInfo() && <CollectionInfo values={values} />}

              <Divider />

              {showMintingControls() && <MintingControls values={values} mintAmount={mintAmount} setMintAmount={setMintAmount} mintNFT={mintNFT} />}
            </Card>

            {/* ADDITIONAL INFO CARDS FOR VARIOUS CONDITIONS */}

            {showSaleClosed() && <SaleClosed />}

            {showSoldOut() && <SoldOut isTestNet={isTestNet} collectionUrl={CollectionConfig.openSeaURL} />}

            {showNotOnMainNet() && <WrongNetwork network={'Ethereum TestNet'} />}

            {showNotOnTestNet() && <WrongNetwork network={'Ethereum MainNet'} />}
          </Stack>
        </Container>

        <Dialog
          open={shouldShowMyAssets}
          onClose={() => viewMyAssets(false)}
          fullWidth
          maxWidth="lg"
          PaperProps={{
            style: {
              minHeight: '50%',
            },
          }}
        >
          <DialogTitle>
            <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h6">My Assets</Typography>
              <IconButton onClick={() => viewMyAssets(false)}>
                <CloseOutlined />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <MyAssets />
          </DialogContent>
          {values.nftWallet && values.nftWallet.length > 0 && (
            <DialogActions style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <Button onClick={() => window.open(`https://${isTestNet ? 'testnets.' : ''}${CollectionConfig.openSeaURL}`, '_blank', 'noopener,noreferrer')} color="primary">
                View on OpenSea
              </Button>
              <Typography align="right" variant="subtitle2">
                Connect to OpenSea Using your Deixa Wallet by Selecting Torus Wallet
              </Typography>
            </DialogActions>
          )}
        </Dialog>

        <Dialog
          open={shouldShowBuyEth}
          onClose={() => onShowBuyEth(false)}
          PaperProps={{
            style: {
              minHeight: '82%',
            },
          }}
        >
          <DialogTitle>
            <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h6"></Typography>
              <IconButton onClick={() => onShowBuyEth(false)}>
                <CloseOutlined />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Onramper />
          </DialogContent>
        </Dialog>
      </div>
    </Container>
  );
}

export default App;
