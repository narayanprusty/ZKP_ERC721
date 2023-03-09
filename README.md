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
circom ./circuits/mint.circom --wasm --r1cs -o ./circuits/build
```

### Generate zKey

```
npx snarkjs groth16 setup ./circuits/build/mint.r1cs ./PTAU/pot12_final.ptau ./keys/mint.zkey
```

### Generate verification key

```
npx snarkjs zkey export verificationkey ./keys/mint.zkey ./keys/mint_verification_key.json
```

### Generate smart contract to verify proof

```
npx snarkjs zkey export solidityverifier ./keys/mint.zkey ./contracts/Verifier/Mint/Verifier.sol
```

## Circom User Commands

### Test mint and transfer

```
npx hardhat run ./scripts/mint_and_transfer.ts
```