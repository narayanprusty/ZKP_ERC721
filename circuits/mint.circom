pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";

template MintFunction() {
  signal input tokenId;
  signal output hashOfTokenId;

  component poseidon = Poseidon(1);
  poseidon.inputs[0] <== tokenId;
  hashOfTokenId <== poseidon.out;
}

component main = MintFunction();