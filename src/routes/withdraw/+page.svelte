<script>
	import { ethers } from 'ethers';
	import { onMount } from 'svelte';

	import TipJarABI from '../../artifacts/src/contracts/TipJar.sol/TipJar.json';

	let userAddress = null;
	let network = null;
	let balance = null;
	let isConnected = false;
	let provider = null;

	let contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

    let amItheOwner = false;
	
	let contract = null;
	let allTips = [];
    let contractBalance = null;
	let isWithdrawing = false;

	/* Setup the contract */

	async function setupContract() {
		if (isConnected && provider) {
			contract = new ethers.Contract(contractAddress, TipJarABI.abi, provider);
            const contractOwner = await contract.owner();
            amItheOwner = ethers.utils.getAddress(contractOwner) === ethers.utils.getAddress(userAddress);
            
            contract.on('NewWithdrawl', async () => {
                contractBalance = await provider.getBalance(contractAddress);
                balance = await provider.getBalance(userAddress);
                isWithdrawing = false;
			});
		}
	}

	// Read the tips from the contract
	async function getTips() {
		if (isConnected) {
			const tips = await contract.getAllTips(); // use the getAllTips function to get all the tips
			allTips = [
				...tips.map((item) => {
					// parse the tips and store them in the allTips array
					return {
						address: item.sender,
						timestamp: new Date(item.timestamp * 1000).toLocaleDateString(),
						message: item.message,
						name: item.name,
						amount: ethers.utils.formatEther(item.amount.toString())
					};
				})
			];
		}
	}

	/* Basic account setup */
	async function setup(accounts) {
		userAddress = accounts[0]; // update the state
		// Get and update the ethereum provider
		try {
			provider = new ethers.providers.Web3Provider(window.ethereum);
			network = await provider.getNetwork();
			balance = await provider.getBalance(userAddress);
            contractBalance = await provider.getBalance(contractAddress); 
			isConnected = true;
			await setupContract();
			await getTips();
			window.ethereum.on('accountsChanged', (accounts) => {
				window.location.reload();
			});
		} catch (e) {
			console.error(e);
		}
	}

	async function connectWallet() {
		if (window.ethereum) {
			// ethereum is an object injected by the wallet. Let's check if is available
			const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }); // use the request method to get the accounts, aka logging in to Metamask
			if (accounts.length > 0) {
				await setup(accounts);
			} else {
				alert('No ethereum accounts found');
			}
		} else {
			alert('No ethereum Wallet found');
		}
	}

	// Let's avoid clicking connect every time and check if the wallet was already connected
	onMount(async () => {
		if (window.ethereum) {
			const accounts = await window.ethereum.request({ method: 'eth_accounts' }); // get the accounts

			if (accounts.length > 0) {
				await setup(accounts);
			}
		}
	});

    async function withdraw() {
        if(isConnected) {
            isWithdrawing = true;
            const rwContract = new ethers.Contract(contractAddress, TipJarABI.abi, provider.getSigner());
            const tx = await rwContract.withdraw();
            await tx.wait();
        }   
    }
</script>

{#if isConnected}
    <h1 class="text-3xl text-gray-800 p-8">Withdraw from the TipJar contract</h1>
    <div class="text-sm text-gray-500 pb-4 flex flex-col gap-4">
        <p class="text-xl text-green-600">
			Successfullly connected with account: <strong>{userAddress}</strong>
		</p> 
        <ul>
            <li>Current Network: {network.name}</li>
            <li>Your current balance: {ethers.utils.formatEther(balance)} eth</li>
            <li>Current contract balance: {ethers.utils.formatEther(contractBalance)} eth</li>
        </ul>

        {#if amItheOwner}
            {#if contractBalance.eq(0)}
                <p class="text-xl text-red-600">There is no balance to withdraw</p>
			{/if}
            <button
                class="bg-blue-600 text-gray-50 shadow-md rounded-md px-3 py-8 text-center disabled:opacity-25"    
                on:click={withdraw}
                disabled={isWithdrawing || contractBalance.eq(0)}
            >{isWithdrawing ? '...Withdrawing' : 'Withdraw'}</button>
        {:else}
            <p class="text-xl text-red-600">Only the owner of the contract can withdraw the balance</p>
        {/if}

    </div>
	
	
	
	<table class="mt-8 border-collapse table-auto w-2/3 mx-auto text-sm h-80 overflow-auto">
		<thead>
			<tr>
				<th class="border-b border-gray-600 font-medium p-4 pl-8 pt-0 pb-3 text-gray-400 text-left"
					>address</th
				>
				<th class="border-b border-gray-600 font-medium p-4 pl-8 pt-0 pb-3 text-gray-400 text-left"
					>Name</th
				>
				<th class="border-b border-gray-600 font-medium p-4 pl-8 pt-0 pb-3 text-gray-400 text-left"
					>Message</th
				>
				<th class="border-b border-gray-600 font-medium p-4 pl-8 pt-0 pb-3 text-gray-400 text-left"
					>Timestamp</th
				>
				<th class="border-b border-gray-600 font-medium p-4 pl-8 pt-0 pb-3 text-gray-400 text-left"
					>Amount</th
				>
			</tr>
		</thead>
		<tbody>
			{#each allTips as item}
				<tr>
					<td class="border-b border-gray-700  p-4 pl-8 text-gray-500">{item.address}</td>
					<td class="border-b border-gray-700  p-4 pl-8 text-gray-500">{item.name}</td>
					<td class="border-b border-gray-700  p-4 pl-8 text-gray-500">{item.message}</td>
					<td class="border-b border-gray-700  p-4 pl-8 text-gray-500">{item.timestamp}</td>
					<td class="border-b border-gray-700  p-4 pl-8 text-gray-500">{item.amount} eth</td>
				</tr>
			{/each}
		</tbody>
	</table>
{:else}
	<button
		class="bg-blue-600 text-gray-50 shadow-md rounded-md px-3 py-8 text-center"
		on:click={connectWallet}>Connect with Wallet</button
	>
{/if}
