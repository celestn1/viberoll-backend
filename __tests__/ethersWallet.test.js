// __tests__/ethersWallet.test.js

require('dotenv').config();
const { ethers } = require('ethers');

describe('Ethers Wallet', () => {
  test('should create a JsonRpcProvider', () => {
    // For ethers v6, create the provider directly using ethers.JsonRpcProvider.
    const provider = new ethers.JsonRpcProvider("https://polygon-rpc.com");
    expect(provider).toBeDefined();
    // Check that the provider's constructor name is "JsonRpcProvider"
    expect(provider.constructor.name).toBe("JsonRpcProvider");
  });
});
