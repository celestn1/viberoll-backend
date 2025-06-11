// backend/services/nftService.js
// Mints an NFT for a video using Ethers.js.

const { ethers } = require('ethers');
require('dotenv').config();
const { NFT } = require('../constants'); // Import NFT configuration from constants

// Setup provider and signer using environment variables.
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const signer = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);

// Create a contract instance using the constants for contract address and ABI.
const contract = new ethers.Contract(NFT.CONTRACT_ADDRESS, NFT.CONTRACT_ABI, signer);

/**
 * Mint an NFT representing a video.
 * @param {string} videoMetadataUri - Metadata URI (e.g., an IPFS hash) for the video.
 * @returns {Promise<string>} The transaction hash if minting succeeds.
 */
async function mintNFT(videoMetadataUri) {
  try {
    // Call the mint function on the contract with the provided video metadata URI.
    const tx = await contract.mint(videoMetadataUri);
    // Wait for the transaction to be confirmed.
    await tx.wait();
    console.log('NFT minted successfully:', tx.hash);
    return tx.hash;
  } catch (error) {
    console.error('Error minting NFT:', error);
    throw error;
  }
}

module.exports = mintNFT;
