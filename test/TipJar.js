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

    it('should return all the tips', async function () {
        const amount = ethers.utils.parseEther("0.002");

        const [owner, sender] = await ethers.getSigners(); // Get two addresses, the owner and the sender        
        // Perform another transaction
        const tx = await contract.connect(sender).sendTip('2nd message', '2nd name', { value: amount });
        await tx.wait();
        const tips = await contract.getAllTips();
        // Since this test ran in the same contract instance as before the total number of tips should be 2
        expect(await contract.getTotalTips()).to.equal(2);
        // The lenght of the tips arrray should be 2 too
        expect(tips.length).to.equal(2);
        // The second element of the tips array should be the same as the transaction sent
        expect(tips[1].message).to.equal('2nd message')
        // The amount of the second element of the tips array should be the same as the transaction sent
        expect(tips[1].amount).to.be.equal(amount)

    })

    it('should react to the tip event', async function () {
        const amount = ethers.utils.parseEther("0.002");

        const [owner, sender] = await ethers.getSigners(); // Get two addresses, the owner and the sender        
        // Perform another transaction
        const tx = await contract.connect(sender).sendTip('event message', 'name', { value: amount });
        await expect(tx).to.emit(contract, 'NewTip').withArgs(sender.address, 'event message', 'name', amount);

    })


});
