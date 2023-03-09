pragma solidity ^0.6.11;
pragma experimental ABIEncoderV2;

import "./Verifier/Mint/Verifier.sol";

contract ERC721 is Verifier {
  address owner;

  // token id hash => owner mapping
  mapping (uint => address) public tokens;

  constructor() public {
    owner = msg.sender;
  }

  struct MintVerifyParameters {
    uint[2] a;
    uint[2][2] b;
    uint[2] c;
    uint[1] input;
  }

  function mint(
    MintVerifyParameters memory proof, uint tokenHash, address to
  ) external {
    require(msg.sender == owner, "owner can only mint tokens");
    
    bool isValid = verifyProof(proof.a, proof.b, proof.c, proof.input);
    if (isValid == true) {
      tokens[tokenHash] = to;
      return;
    }

    revert();
  }
}