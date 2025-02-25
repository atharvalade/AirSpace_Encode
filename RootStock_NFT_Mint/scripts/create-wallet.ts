import { ethers } from "ethers";
import * as fs from "fs";

// Generate a random account
const wallet = ethers.Wallet.createRandom();

console.log("Address:", wallet.address);
console.log("Private Key:", wallet.privateKey);
console.log("Mnemonic:", wallet.mnemonic.phrase);

// Save to .env file (append)
fs.appendFileSync(".env", `\n# New wallet generated on ${new Date()}\n`);
fs.appendFileSync(".env", `NEW_PRIVATE_KEY=${wallet.privateKey.slice(2)}\n`);
fs.appendFileSync(".env", `NEW_ADDRESS=${wallet.address}\n`);

console.log("\nWallet info saved to .env file");
console.log("IMPORTANT: Fund this address with testnet RBTC before using"); 