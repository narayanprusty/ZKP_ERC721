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

  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

  const ERC721:ERC721__factory = await ethers.getContractFactory("ERC721");
  const erc721 = await ERC721.deploy(mintVerifier.address, ZERO_ADDRESS, ZERO_ADDRESS);
  
  const [,user1] = await ethers.getSigners()

  const mintSalt = "17254799956404971811039702150918140282394663883969466224119104286103122128472"
  const { proof: mintProof, publicSignals: mintPublicSignals } = await snarkjs.groth16.fullProve(
    { tokenId: 1, salt: mintSalt }, 
    "./circuits/build/mint_js/mint.wasm", 
    "./keys/mint.zkey"
  );

  const mintSolidityProof = await generateSolidityMintProof(mintProof, mintPublicSignals)
  
  await erc721.mint(
    mintSolidityProof, 
    user1.address
  )

  const { proof: ownershipProof, publicSignals: ownershipPublicSignals } = await snarkjs.groth16.fullProve(
    { tokenId: 1, salt: mintSalt }, 
    "./circuits/build/ownership_js/ownership.wasm", 
    "./keys/ownership.zkey"
  );

  const zKey = JSON.parse(fs.readFileSync("./keys/ownership_verification_key.json"));
  const res = await snarkjs.groth16.verify(zKey, ownershipPublicSignals, ownershipProof);

  if (res === false) {
    console.log("Verification FAILED!!!!");
    return
  }

  const tokenOwner = await erc721.tokens(ownershipPublicSignals[0])

  if (ownershipPublicSignals[1] == "1") {
    console.log("Validated token id: 1")
  }

  if (tokenOwner == user1.address) {
    console.log("Validated token 1 owner: ", tokenOwner)
  }

  process.exit()
}

main()