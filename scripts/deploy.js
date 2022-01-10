import fs from 'fs';
import readLastLines from 'read-last-lines';

const updateEnv = async (address) => {
    const lines = await readLastLines.read('.env', 1)

    if (lines.includes('VITE_CONTRACT_ADDRESS')) {
        const stats = await fs.promises.stat('.env')
        await fs.promises.truncate('.env', stats.size - lines.length)
        console.log('File truncated!');
    }
    await fs.promises.appendFile('.env', `\nVITE_CONTRACT_ADDRESS=${address}`);
}

const main = async () => {
    const [deployer] = await hre.ethers.getSigners();
    const accountBalance = await deployer.getBalance();

    console.log("Deploying contracts with account: ", deployer.address);
    console.log("Account balance: ", accountBalance.toString());

    const Token = await hre.ethers.getContractFactory("TipJar");
    const contract = await Token.deploy();
    await contract.deployed();

    // Write the contract address into .env 
    // append data to a file
    await updateEnv(contract.address);

    console.log("TipJar address: ", contract.address);

};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

runMain();