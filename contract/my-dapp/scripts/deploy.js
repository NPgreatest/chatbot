const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contract with the account:", deployer.address);

    const MemoryApproval = await ethers.getContractFactory("MemoryApproval");
    const contract = await MemoryApproval.deploy();

    await contract.waitForDeployment(); // ✅ Ensure deployment is complete

    console.log("Contract deployed at:", await contract.getAddress()); // ✅ Correct way to fetch the address
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
