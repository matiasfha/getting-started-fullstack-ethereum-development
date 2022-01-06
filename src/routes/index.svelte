<script>
	import { ethers, utils } from 'ethers';
	import { formatEther } from 'ethers/lib/utils';
	let userAddress = null;
	let provider = null;
	let network = null;
	let balance = null;
	let isConnected = false;

	async function connectWallet() {
		if (window.ethereum) {
			// ethereum is an object injected by the wallet. Let's check if is available
			const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }); // use the request method to get the accounts, aka logging in to Metamask
			if (accounts.length > 0) {
				// it returns an array of accounts, it should have at least 1 element
				userAddress = accounts[0]; // update the state
				// Get and update the ethereum provider
				provider = new ethers.providers.Web3Provider(window.ethereum);
				network = await provider.getNetwork();
				balance = await provider.getBalance(userAddress);
				await addEthereumListeners();
				isConnected = true;
			} else {
				alert('No ethereum accounts found');
			}
		} else {
			alert('No ethereum Wallet found');
		}
	}

	// Setup listeners for various wallet events
	async function addEthereumListeners() {
		window.ethereum.on('accountsChanged', async (accounts) => {
			if (accounts.length > 0) {
				userAddress = accounts[0];
				balance = await provider.getBalance(userAddress);
			}
		});

		window.ethereum.on('chainChanged', async () => {
			window.location.reload();
		});
	}
</script>

<h1 class="text-3xl text-gray-800 p-8">Welcome to my Eth Tip Jar</h1>

{#if isConnected}
	<p class="text-xl text-green-600">
		Successfullly connected with account: <strong>{userAddress}</strong>
	</p>
	<ul>
		<li>Current Network: {network.name}</li>
		<li>Your current balance: {ethers.utils.formatEther(balance)} eth</li>
	</ul>
{:else}
	<button
		on:click={connectWallet}
		class="bg-blue-600 text-gray-50 shadow-md rounded-md px-3 py-8 text-center"
		>Connect with Wallet</button
	>
{/if}
