# ZKP ERC721

This repo is an example of zkp based ERC721. In the smart contract we hide the ID and owner of the tokens minted.  

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

circom ./circuits/sender.circom --wasm --r1cs -o ./circuits/build
circom ./circuits/receiver.circom --wasm --r1cs -o ./circuits/build

circom ./circuits/ownership.circom --wasm --r1cs -o ./circuits/build
```

### Generate zKey

```
npx snarkjs groth16 setup ./circuits/build/mint.r1cs ./PTAU/pot12_final.ptau ./keys/mint.zkey

npx snarkjs groth16 setup ./circuits/build/sender.r1cs ./PTAU/pot12_final.ptau ./keys/sender.zkey
npx snarkjs groth16 setup ./circuits/build/receiver.r1cs ./PTAU/pot12_final.ptau ./keys/receiver.zkey

npx snarkjs groth16 setup ./circuits/build/ownership.r1cs ./PTAU/pot12_final.ptau ./keys/ownership.zkey
```

### Generate verification key

```
npx snarkjs zkey export verificationkey ./keys/mint.zkey ./keys/mint_verification_key.json

npx snarkjs zkey export verificationkey ./keys/sender.zkey ./keys/sender_verification_key.json
npx snarkjs zkey export verificationkey ./keys/receiver.zkey ./keys/receiver_verification_key.json

npx snarkjs zkey export verificationkey ./keys/ownership.zkey ./keys/ownership_verification_key.json
```

### Generate smart contract to verify proof

```
npx snarkjs zkey export solidityverifier ./keys/mint.zkey ./contracts/Verifier/Mint/Verifier.sol

npx snarkjs zkey export solidityverifier ./keys/sender.zkey ./contracts/Verifier/Sender/Verifier.sol
npx snarkjs zkey export solidityverifier ./keys/receiver.zkey ./contracts/Verifier/Receiver/Verifier.sol
```

## Circom User Commands

### Test mint and transfer

```
npx hardhat run ./scripts/mint_and_transfer.ts
npx hardhat run ./scripts/ownership.ts
```