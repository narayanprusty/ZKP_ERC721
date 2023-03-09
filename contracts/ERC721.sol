pragma solidity ^0.6.11;
pragma experimental ABIEncoderV2;

interface IMintVerififer {
  struct VerifyParameters {
    uint[2] a;
    uint[2][2] b;
    uint[2] c;
    uint[1] input;
  }

  function verifyProof(
    uint[2] memory a,
    uint[2][2] memory b,
    uint[2] memory c,
    uint[1] memory input
  ) external view returns (bool r);
}

interface ISenderVerififer {
  struct VerifyParameters {
    uint[2] a;
    uint[2][2] b;
    uint[2] c;
    uint[1] input;
  }

  function verifyProof(
    uint[2] memory a,
    uint[2][2] memory b,
    uint[2] memory c,
    uint[1] memory input
  ) external view returns (bool r);
}

interface IReceiverVerififer {
  struct VerifyParameters {
    uint[2] a;
    uint[2][2] b;
    uint[2] c;
    uint[2] input;
  }

  function verifyProof(
    uint[2] memory a,
    uint[2][2] memory b,
    uint[2] memory c,
    uint[2] memory input
  ) external view returns (bool r);
}

contract ERC721 {
  address owner;

  // token id hash => owner mapping
  mapping (uint => address) public tokens;

  IMintVerififer mintVerifier;
  ISenderVerififer senderVerifier;
  IReceiverVerififer receiververifier;

  constructor(
    IMintVerififer _mintVerifier,
    ISenderVerififer _senderVerfier,
    IReceiverVerififer _receiverVerifier
  ) public {
    owner = msg.sender;
    mintVerifier = _mintVerifier;
    senderVerifier = _senderVerfier;
    receiververifier = _receiverVerifier;
  }

  function mint(
    IMintVerififer.VerifyParameters memory proof, address to
  ) external {
    require(msg.sender == owner, "owner can only mint tokens");
    
    bool isValid = mintVerifier.verifyProof(proof.a, proof.b, proof.c, proof.input);
    if (isValid == true) {
      tokens[proof.input[0]] = to;
      return;
    }

    revert();
  }

  function transfer(
    ISenderVerififer.VerifyParameters memory senderProof,
    IReceiverVerififer.VerifyParameters memory receiverProof,
    uint tokenHash,
    address to
  ) external {
    require(msg.sender == tokens[tokenHash], "owner can only transfer token");

    bool isValidSender = senderVerifier.verifyProof(
      senderProof.a, 
      senderProof.b, 
      senderProof.c, 
      senderProof.input
    );
    
    bool isValidReceiver = receiververifier.verifyProof(
      receiverProof.a, 
      receiverProof.b, 
      receiverProof.c, 
      receiverProof.input
    );
    
    if (isValidSender == false || isValidReceiver == false) {
      revert("invalid proof");
    }

    if (senderProof.input[0] == receiverProof.input[0]) {
      revert("invalid token transfer");
    }

    delete tokens[tokenHash];
    tokens[receiverProof.input[1]] = to;
  }
}