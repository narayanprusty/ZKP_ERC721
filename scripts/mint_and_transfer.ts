import { ERC721__factory } from "../typechain-types";
import { ethers } from "hardhat";

const snarkjs = require('snarkjs');
const fs = require('fs');

const generateSolidityMintProof = async (proof, publicSignals) => {
  let solidityProof = await snarkjs.groth16.exportSolidityCallData(
    proof, 
    publicSignals
  );

  let proofArr = solidityProof.replaceAll('"', '').replaceAll(',', '').replaceAll('[', '').replaceAll(']', '').replaceAll(' ', '')
  proofArr = proofArr.split('0x')

  return {
    a: ['0x'+proofArr[1], '0x'+proofArr[2]],
    b: [
      [
        '0x'+proofArr[3], '0x'+proofArr[4]
      ],
      [
        '0x'+proofArr[5], '0x'+proofArr[6]
      ]
    ],
    c: ['0x'+proofArr[7], '0x'+proofArr[8]],
    input: ['0x'+proofArr[9]]
  };
}

async function main() {
  const MintVerifier = await ethers.getContractFactory("contracts/Verifier/Mint/Verifier.sol:Verifier");
  const mintVerifier = await MintVerifier.deploy();

  const SenderVerifier = await ethers.getContractFactory("contracts/Verifier/Sender/Verifier.sol:Verifier");
  const senderVerifier = await SenderVerifier.deploy();

  const ReceiverVerifier = await ethers.getContractFactory("contracts/Verifier/Sender/Verifier.sol:Verifier");
  const receiverVerifier = await ReceiverVerifier.deploy();

  const ERC721:ERC721__factory = await ethers.getContractFactory("ERC721");
  const erc721 = await ERC721.deploy(mintVerifier.address, senderVerifier.address, receiverVerifier.address);
  
  const [,user1] = await ethers.getSigners()

  //1. Mint token id 1
  const mintSalt = "17254799956404971811039702150918140282394663883969466224119104286103122128472"
  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    { tokenId: 1, salt: mintSalt }, 
    "./circuits/build/mint_js/mint.wasm", 
    "./keys/mint.zkey"
  );

  let solidityProof = await generateSolidityMintProof(proof, publicSignals)
  
  await erc721.mint(
    solidityProof, 
    user1.address
  )

  console.log(`Minted token id 1 to user: ${await erc721.tokens(publicSignals[0])}`)

  process.exit()
}

main()