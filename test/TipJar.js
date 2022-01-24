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
        const balance = await ethers.provider.getBalance(contract.address) // Get the account balance of the contract
        const senderBalance = await sender.getBalance();
        /*
        * perform the send transaction
        * You pass the message and the name as arguments and the value as an object that is then
        * used as the global `msg` object in the contract
        * to define the amount of ETH use the parseEther utility
        */
        const tx = await contract.connect(sender).sendTip('message', 'name', { value: ethers.utils.parseEther("0.001") });
        await tx.wait();


        const newBalance = await ethers.provider.getBalance(contract.address) // Get the new balance of the contract
        const newSenderBalance = await sender.getBalance();
        expect(newBalance).to.be.above(balance) // Check that the new balance if greater than before
        expect(newSenderBalance).to.be.below(senderBalance); // Check that the sender balance is less than before
        expect(await contract.getTotalTips()).to.equal(1); // Get the total number of tips
    })

    it('should return all the tips', async function () {
        const amount = ethers.utils.parseEther("0.002");

        const [, sender] = await ethers.getSigners(); // Get two addresses, the owner and the sender        
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

    it('should fail to send eth bigger than the balance', async function () {
        const [, sender] = await ethers.getSigners(); // Get two addresses, the owner and the sender        
        const amount = ethers.utils.parseEther("9999");
        // Perform another transaction
        const tx = contract.connect(sender).sendTip('event message', 'name', { value: amount });
        await expect(tx).to.be.reverted;
    })

    it('should react to the tip event', async function () {
        const [, sender] = await ethers.getSigners(); // Get two addresses, the owner and the sender        
        const amount = ethers.utils.parseEther("0.1");
        const tipContract = contract.connect(sender);
        const tx = await tipContract.sendTip('event message', 'name', { value: amount });
        await tx.wait()
        expect(tx).to.emit(contract, 'NewTip').withArgs(sender.address, 'event message', 'name', amount);
    })

    it('should allow the owner to withdraw the whole balance', async function () {
        const [owner] = await ethers.getSigners();
        const ownerBalance = await owner.getBalance(); // get the owner balance
        const originalContractBalance = await ethers.provider.getBalance(contract.address) // Get the contract balance
        const tips = await contract.getAllTips(); //Get all the tips 
        const sumTips = tips.reduce((acc, tip) => acc.add(tip.amount), ethers.BigNumber.from(0)); // Get the total amount of tips
        expect(sumTips).to.be.equals(originalContractBalance); //Since this is the first widthdraw the sum of the tips should be the same as the contract balance
        /*
        * perform the withdraw transaction
        */
        const tx = await contract.withdraw();
        await tx.wait();

        const newOwnerBalance = await owner.getBalance()// Get the new balance of the owner
        const contractBalance = await ethers.provider.getBalance(contract.address) // Get the account balance of the contract 



        expect(newOwnerBalance).to.be.above(ownerBalance) // Check that the new balance if greater than before
        expect(contractBalance).to.be.equal(0); // Check that the contract balance is zero

        // Since there is no balance in the contract
        // the withdraw should fail
        await expect(contract.withdraw()).to.be.reverted;

    })

    it('should reject withdrawal from another address different than owner', async function () {
        const [, otherUser] = await ethers.getSigners();
        // Try to withdraw again
        // it should fail since there is no eth in the contract
        await expect(contract.connect(otherUser).withdraw()).to.be.reverted;

    })



});