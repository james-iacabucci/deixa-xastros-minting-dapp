// REACT LIBRARIES
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

// UI LIBRARIES
import { Card, CardMedia, Stack, Divider, Link, Container } from '@mui/material';

// WEB3 LIBRARIES
import { BigNumber } from 'ethers';
import { useMoralis, useNativeBalance, useChain } from 'react-moralis';

// DAPP ASSETS
import Header from './../Header/Header';
import Freelist from '../Utils/Freelist';
import Goldlist from '../Utils/Goldlist';
import background from '../../assets/background4.png';
import XastroLogo from '../../assets/Logos/Xastro.png';
import CollectionConfig from '../../Config/CollectionConfig';

// DAPP COMPONENTS
import SoldOut from '../Status/SoldOut';
import SaleClosed from '../Status/SaleClosed';
import WrongNetwork from '../Status/WrongNetwork';
import NoContractFond from '../Status/NoContractFound';
import NoWalletConnected from '../Status/NoWalletConnected';
import SomethingWentWrong from '../Status/SomethingWentWrong';
import CollectionInfo from '../CollectionInfo/CollectionInfo';
import TransactionComplete from '../Status/TransactionComplete';
import MintingControls from '../MintingControls/MintingControls';
import LoadingCollectionInfo from '../Status/LoadingCollectionInfo';
import ProcessingTransaction from '../Status/ProcessingTransaction';

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

  const { chainId } = useChain();
  const { data: userWallet } = useNativeBalance();

  const { authenticate, logout, isWeb3Enabled, isInitialized, enableWeb3, isAuthenticated, isWeb3EnableLoading, account, chain, Moralis } = useMoralis();

  let nftContractOptions = {
    contractAddress: CollectionConfig.contractAddress,
    abi: nftContractAbi,
    functionName: null,
    msgValue: 0,
  };

  useEffect(() => {
    console.log('isInitialized', isInitialized);
  }, [isInitialized]);

  useEffect(() => {
    console.log('isWeb3Enabled', isWeb3Enabled);
  }, [isWeb3Enabled]);

  useEffect(() => {
    console.log('isAuthenticated', isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    console.log('chainId', chainId);
  }, [chainId]);

  function getProviderParam(providerId) {
    switch (providerId) {
      case 'walletconnect':
        //return { provider: providerId, chainId: parseInt(AppConfig.supportChainId, 16) };
        return { provider: providerId, chainId: 4 };
      //case 'web3Auth':
      //  return { provider: providerId, clientId: AppConfig.web3AuthClientId, chainId: AppConfig.supportChainId, appLogo: logo };
      case 'metamask':
      default:
        return { provider: providerId };
    }
  }

  async function signIn(providerId) {
    await authenticate({ provider: providerId });
    localStorage.setItem('local_provider', providerId);
  }

  async function signOut() {
    await logout();
    localStorage.removeItem('local_provider');
    setValues(() => defaultState);
  }

  useEffect(() => {
    async function initialize() {
      if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) {
        console.log('CALLING WEB3ENABLE');
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

  useEffect(() => {
    //console.log('VALUES', values);
    //console.log('PARAM', promotionCode);
  }, [values]);

  async function initWallet() {
    setProcessing(true);
    console.log('CALLING INIT WALLET');
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

  const isMainNet = () => chainId === '0x1';
  const isTestNet = () => chainId === '0x4';
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
  const showNotOnMainNet = () => !processing && !values.isReleased && isMainNet();
  const showNotOnTestNet = () => !processing && values.isReleased && !isMainNet();

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
              <Link href={`https://${!values.isReleased ? 'rinkeby.' : ''}etherscan.io/address/${nftContractOptions.contractAddress}`} target="_blank">
                <CardMedia component="img" image={XastroLogo} alt="DEIXA Xastro" sx={{ bgcolor: 'black', py: 2, borderRadius: '4px 4px 0 0' }} />
              </Link>

              {showNoWalletConnected() && <NoWalletConnected signIn={signIn} />}

              {showContractNotFound() && <NoContractFond />}

              {showSomethingWentWrong() && <SomethingWentWrong error={error} setError={setError} />}

              {showLoadingCollectionInfo() && <LoadingCollectionInfo />}

              {showProcessingTransaction() && <ProcessingTransaction transaction={transaction} isTestNet={isTestNet} />}

              {showTransactionComplete() && <TransactionComplete transaction={transaction} acknowledge={acknowledgeTransaction} isTestNet={isTestNet} />}

              {showCollectionInfo() && <CollectionInfo values={values} />}

              <Divider />

              {showMintingControls() && <MintingControls values={values} mintAmount={mintAmount} setMintAmount={setMintAmount} mintNFT={mintNFT} />}

              {/*               <CrossmintPayButton
                collectionTitle="Xastro Origin"
                collectionDescription="DEIXA Xastro Origin is a collection of 14,444 unique NFTs that are the gateway to an innovative diverse & inclusive community, built around epic reward experiences and obsessed with data privacy, respect and transparency."
                collectionPhoto="<COLLECTION_IMAGE_URL>"
                clientId="9d9a47e1-cf27-4c12-836a-955b4f3dc8f1"
                mintConfig={{ type: 'erc-721', totalPrice: `"${mintCostInEth().toString()}"`, _mintAmount: `"${mintAmount.toString()}"`, _promotionCode: promotionCode ? promotionCode : 'deixa' }}
                environment="staging"
              /> */}
            </Card>

            {/* ADDITIONAL INFO CARDS FOR VARIOUS CONDITIONS */}

            {showSaleClosed() && <SaleClosed />}

            {showSoldOut() && <SoldOut isTestNet={isTestNet} collectionUrl={CollectionConfig.openSeaURL} />}

            {showNotOnMainNet() && <WrongNetwork network={'Ethereum TestNet'} />}

            {showNotOnTestNet() && <WrongNetwork network={'Ethereum MainNet'} />}
          </Stack>
        </Container>
      </div>
    </Container>
  );
}

export default App;
