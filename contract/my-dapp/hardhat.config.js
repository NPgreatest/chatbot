require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // If using environment variables for private keys

module.exports = {
    solidity: "0.8.19", // Ensure this is compatible with your contract
    networks: {
        sepolia: {
            url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`, // Replace with your Infura URL
            accounts: [`0x${process.env.PRIVATE_KEY}`], // Ensure the "0x" prefix
        },
    },
};
