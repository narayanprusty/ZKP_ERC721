const snarkjs = require('snarkjs');
const fs = require('fs');

async function main() {
  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    { in: 20 }, 
    "./circuits/build/poseidon_hasher_js/poseidon_hasher.wasm", 
    "./keys/user_0000.zkey");

  fs.writeFileSync('./proofs/publicSignals.json', JSON.stringify(publicSignals), 'utf8', () => {});
  fs.writeFileSync('./proofs/proof.json', JSON.stringify(proof), 'utf8', () => {});

  process.exit()
}

main()
