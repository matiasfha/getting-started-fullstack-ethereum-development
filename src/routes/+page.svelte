<script>
	import { ethers } from 'ethers';
	import { onMount } from 'svelte';
	let userAddress = null;
	let network = null;
	let balance = null;
	let isConnected = false;

	/* Basic account setup */
	async function setup(accounts) {
		userAddress = accounts[0]; // update the state
		// Get and update the ethereum provider
		try {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			network = await provider.getNetwork();
			balance = await provider.getBalance(userAddress);

			isConnected = true;
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
</script>

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
		class="bg-blue-600 text-gray-50 shadow-md rounded-md px-3 py-8 text-center"
		on:click={connectWallet}>Connect with Wallet</button
	>
{/if}
