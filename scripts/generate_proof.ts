const snarkjs = require('snarkjs');
const fs = require('fs');

async function main() {
  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    { tokenId: 10 }, 
    "./circuits/build/mint_js/mint.wasm", 
    "./keys/mint.zkey");

  fs.writeFileSync('./proofs/publicSignals.json', JSON.stringify(publicSignals), 'utf8', () => {});
  fs.writeFileSync('./proofs/proof.json', JSON.stringify(proof), 'utf8', () => {});

  process.exit()
}

main()
