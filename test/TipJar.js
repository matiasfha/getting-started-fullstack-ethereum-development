const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('TipJar', function () {
    let contract;

    it('Should deploy the contract and return 0 as totalTips', async function () {
        const contractFactory = await ethers.getContractFactory('TipJar');
        contract = await contractFactory.deploy();
        await contract.deployed();
        expect(await contract.totalTips()).to.equal(0);
    });
});