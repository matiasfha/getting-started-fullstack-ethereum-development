const { expect } = require("chai"); // Require the assertion library
const { ethers } = require("hardhat");

describe("TipJar", function () { //describe the main test
    let contract;

    it("Should deploy the contract and return 0 as totalTips", async function () {
        const contractFactory = await ethers.getContractFactory("TipJar"); //Create an abstraction of the contract used to deploy the TipJar
        contract = await contractFactory.deploy(); // Start the deployment process, resolves to a Contract object
        await contract.deployed(); // make sure the contact was deployed
        expect(await contract.totalTips()).to.equal(0); // Retrieve the public variable as async function
    });


});
