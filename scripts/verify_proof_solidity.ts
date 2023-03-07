import hre from "hardhat";
import { ethers } from "hardhat";
import { Verifier__factory } from "../typechain-types";

const snarkjs = require('snarkjs');
const fs = require('fs');

async function main() {
  const publicSignals = JSON.parse(fs.readFileSync("./proofs/publicSignals.json"));
  const proof = JSON.parse(fs.readFileSync("./proofs/proof.json"));
  
  let solidityProof = await snarkjs.groth16.exportSolidityCallData(
    proof, 
    publicSignals
  );

  let proofArr = solidityProof.replaceAll('"', '').replaceAll(',', '').replaceAll('[', '').replaceAll(']', '').replaceAll(' ', '')
  proofArr = proofArr.split('0x')

  const Verifier:Verifier__factory = await ethers.getContractFactory("Verifier");
  const verifier = await Verifier.deploy();
    
  const result = await verifier.verifyProof(
    ['0x'+proofArr[1], '0x'+proofArr[2]],
    [
      [
        '0x'+proofArr[3], '0x'+proofArr[4]
      ],
      [
        '0x'+proofArr[5], '0x'+proofArr[6]
      ]
    ],
    ['0x'+proofArr[7], '0x'+proofArr[8]],
    ['0x'+proofArr[9]]
  )

  console.log(result)

  process.exit()
}

main()
