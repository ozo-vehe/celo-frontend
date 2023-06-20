const { ethers } = require("hardhat");

async function main() {
  // Load the marketplace contract artifacts
  const juakaliMarketplaceFactory = await ethers.getContractFactory(
    "JuakaliMarketplace"
  );

  // Deploy the contract
  const juakaliMarketplaceContract = await juakaliMarketplaceFactory.deploy();

  // Wait for deployment to finish
  await juakaliMarketplaceContract.deployed();

  // Log the address of the new contract
  console.log(
    "Juakali Marketplace deployed to:",
    juakaliMarketplaceContract.address
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
