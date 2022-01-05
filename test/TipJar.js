const { expect } = require("chai"); // Require the assertion library
const { ethers } = require("hardhat");

describe("TipJar", function () { //describe the main test
    let contract;
    this.beforeAll(async () => {
        // Deploy the contract once for every test case
        const contractFactory = await ethers.getContractFactory("TipJar"); //Create an abstraction of the contract used to deploy the TipJar
        contract = await contractFactory.deploy(); // Start the deployment process, resolves to a Contract object
        await contract.deployed();
    })
    it("Should deploy the contract and return 0 as totalTips", async function () {
        expect(await contract.getTotalTips()).to.equal(0); // Retrieve the total number of tips
    });

    it('Should allow to send a tip and increase the number of total tips', async function () {
        const [owner, sender] = await ethers.getSigners(); // Get two addresses, the owner and the sender
        const balance = await owner.getBalance(); // Get the account balance of the owner

        /*
        * perform the send transaction
        * You pass the message and the name as arguments and the value as an object that is then
        * used as the global `msg` object in the contract
        * to define the amount of ETH use the parseEther utility
        */
        const tx = await contract.connect(sender).sendTip('message', 'name', { value: ethers.utils.parseEther("0.001") });
        await tx.wait();


        const newBalance = await owner.getBalance(); // Get the new balance of the owner account

        expect(newBalance).to.be.above(balance) // Check that the new balance if greater than before
        expect(await contract.getTotalTips()).to.equal(1); // Get the total number of tips
    })


});
