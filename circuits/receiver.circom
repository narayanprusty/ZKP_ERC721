pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";

template ReceiverFunction() {
  signal input tokenId;
  signal input salt;
  signal input newSalt;
  signal output hashOfTokenId;
  signal output newHashOfTokenId;

  component poseidon1 = Poseidon(1);
  poseidon1.inputs[0] <== tokenId;

  component poseidon2 = Poseidon(1);
  poseidon2.inputs[0] <== poseidon1.out + salt;
  hashOfTokenId <== poseidon2.out;

  component poseidon3 = Poseidon(1);
  poseidon3.inputs[0] <== poseidon1.out + newSalt;
  newHashOfTokenId <== poseidon2.out;
}

component main = ReceiverFunction();