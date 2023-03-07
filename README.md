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

### Compile Circuit

```
circom ./circuits/poseidon_hasher.circom --wasm --r1cs -o ./circuits/build
```

### Generating PTAU

```
npx snarkjs powersoftau new bn128 12 ./PTAU/pot12_0000.ptau -v
npx snarkjs powersoftau contribute ./PTAU/pot12_0000.ptau ./PTAU/pot12_0001.ptau --name="Narayan" -v
npx snarkjs powersoftau prepare phase2 ./PTAU/pot12_0001.ptau ./PTAU/pot12_final.ptau -v
```

## Circom User Commands

### Generate zKey for user

```
npx snarkjs groth16 setup ./circuits/build/poseidon_hasher.r1cs ./PTAU/pot12_final.ptau ./keys/user_0000.zkey
```

### User generates proof

```
npx hardhat run ./scripts/generate_proof.ts
```

### Generate user's verification key

```
npx snarkjs zkey export verificationkey ./keys/user_0000.zkey ./keys/user_0000_verification_key.json
```

### Verify proof

```
npx hardhat run ./scripts/verify_proof.ts
```