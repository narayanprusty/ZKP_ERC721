# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```

## Circom Developer Command

### Generating PTAU

```
npx snarkjs powersoftau new bn128 12 ./PTAU/pot12_0000.ptau -v
npx snarkjs powersoftau contribute ./PTAU/pot12_0000.ptau ./PTAU/pot12_0001.ptau --name="Narayan" -v
npx snarkjs powersoftau prepare phase2 ./PTAU/pot12_0001.ptau ./PTAU/pot12_final.ptau -v
```

### Compile Circuit

```
circom ./circuits/poseidon_hasher.circom --wasm --r1cs -o ./circuits/build

circom ./circuits/mint.circom --wasm --r1cs -o ./circuits/build
```

### Generate zKey

```
npx snarkjs groth16 setup ./circuits/build/poseidon_hasher.r1cs ./PTAU/pot12_final.ptau ./keys/poseidon_hasher.zkey

npx snarkjs groth16 setup ./circuits/build/mint.r1cs ./PTAU/pot12_final.ptau ./keys/mint.zkey
```

### Generate verification key

```
npx snarkjs zkey export verificationkey ./keys/poseidon_hasher.zkey ./keys/poseidon_hasher_verification_key.json

npx snarkjs zkey export verificationkey ./keys/mint.zkey ./keys/mint_verification_key.json
```

### Generate smart contract to verify proof

```
npx snarkjs zkey export solidityverifier ./keys/poseidon_hasher.zkey ./contracts/verifier.sol

npx snarkjs zkey export solidityverifier ./keys/mint.zkey ./contracts/Verifier.sol
```

## Circom User Commands

### User generates proof

```
npx hardhat run ./scripts/generate_proof.ts
```

### Verify proof in JS

```
npx hardhat run ./scripts/verify_proof.ts
```

### Export proof for verification and verify

```
npx hardhat run ./scripts/verify_proof_solidity.ts
```

```
npx hardhat run ./scripts/user_flow.ts
```