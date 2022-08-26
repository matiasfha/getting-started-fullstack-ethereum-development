const main = async () => {
    const [deployer] = await hre.ethers.getSigners();
    console.log('Deploying the contract with ', deployer.address);

    const contractFactory = await hre.ethers.getContractFactory('TipJar');
    const contract = await contractFactory.deploy();
    await contract.deployed();
    console.log('Tip Jar deployed, address: ', contract.address);
}

const run = async () => {
    try {
        await main();
        process.exit(0)
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}
run();