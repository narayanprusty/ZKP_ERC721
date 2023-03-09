pragma solidity ^0.8.18;

import "./Verifier.sol";

contract ERC721 is Verifier {
  address owner;

  // token id hash => owner mapping
  mapping (uint => address) public tokens;

  constructor() {
    owner = msg.sender;
  }

  struct VerifParameters {
    uint[2] a;
    uint[2][2] b;
    uint[2] c;
    uint[1] input;
  }

  function mint(
    VerifParameters memory proof, uint tokenHash, address to
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