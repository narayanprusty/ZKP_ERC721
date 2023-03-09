const snarkjs = require('snarkjs');
const fs = require('fs');

async function main() {
  const vKey = JSON.parse(fs.readFileSync("./keys/mint_verification_key.json"));
  const publicSignals = JSON.parse(fs.readFileSync("./proofs/publicSignals.json"));
  const proof = JSON.parse(fs.readFileSync("./proofs/proof.json"));
  const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);

  if (res === true) {
    console.log("Verification OK");
  } else {
    console.log("Invalid proof");
  }

  process.exit()
}

main()
