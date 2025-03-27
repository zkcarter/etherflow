import { ethers } from "hardhat";

async function main() {
  console.log("Deploying contracts...");

  // Deploy TestToken
  const TestToken = await ethers.getContractFactory("TestToken");
  const testToken = await TestToken.deploy();
  await testToken.waitForDeployment();
  console.log("TestToken deployed to:", await testToken.getAddress());

  // Deploy ComplexContract
  const ComplexContract = await ethers.getContractFactory("ComplexContract");
  const complexContract = await ComplexContract.deploy();
  await complexContract.waitForDeployment();
  console.log("ComplexContract deployed to:", await complexContract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 