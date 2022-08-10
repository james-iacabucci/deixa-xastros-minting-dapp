const AppConfig = {
  moralisAppId: process.env.REACT_APP_MORALIS_APPLICATION_ID,
  moralisServerUrl: process.env.REACT_APP_MORALIS_SERVER_URL,
  web3AuthClientId: process.env.REACT_APP_WEB3_AUTH_CLIENT_ID,
  supportChainId: process.env.REACT_APP_SUPPORT_CHAIN_ID_HEX,
  supportChainName: process.env.REACT_APP_SUPPORT_CHAIN_NAME,
  nftContract: process.env.REACT_APP_NFT_CONTRACT_ADDRESS,
  isMainnet: process.env.REACT_APP_MAINNET === '1',
  isMyAssetsEnabled: process.env.REACT_APP_ENABLE_MYASSETS === '1',
  isFiatEnabled: process.env.REACT_APP_ENABLE_FIAT === '1',
};

export default AppConfig;
