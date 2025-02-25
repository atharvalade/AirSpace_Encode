
## How to Use These Scripts
To mint all NFTs at once:
   npx hardhat run scripts/mint-all.ts --network rsktestnet
To read metadata from all minted NFTs:
   npx hardhat run scripts/read-metadata.ts --network rsktestnet
To read metadata for a specific token ID:
   TOKEN_ID=1 npx hardhat run scripts/read-metadata.ts --network rsktestnet
