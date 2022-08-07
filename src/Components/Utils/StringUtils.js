export default class StringUtils {
  static convertIpfsUriToIpfsUrl(uri) {
    if (uri.startsWith('ipfs://ipfs/')) {
      return `https://ipfs.io/ipfs/${uri.replaceAll('ipfs://ipfs/', '')}`;
    } else if (uri.startsWith('ipfs://')) {
      return `https://ipfs.io/ipfs/${uri.replaceAll('ipfs://', '')}`;
    } else {
      return uri;
    }
  }
}
