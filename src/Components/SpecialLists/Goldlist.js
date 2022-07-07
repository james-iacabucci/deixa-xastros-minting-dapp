import goldlistAddresses from '../../Config/goldlist.json';
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';

export default new class Goldlist {
  merkleTree

  getMerkleTree()
  {
    if (this.merkleTree === undefined) {
      const leafNodes = goldlistAddresses.map(addr => keccak256(addr));
      this.merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
    }
    return this.merkleTree;
  }

  getProofForAddress(address)
  {
    return this.getMerkleTree().getHexProof(keccak256(address));
  }

  getRawProofForAddress(address)
  {
    return this.getProofForAddress(address).toString().replaceAll('\'', '').replaceAll(' ', '');
  }

  contains(address)
  {
    return this.getMerkleTree().getLeafIndex(Buffer.from(keccak256(address))) >= 0;
  }
};