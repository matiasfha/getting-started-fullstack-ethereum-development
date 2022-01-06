<script>
	import { ethers, utils } from 'ethers';
	import { formatEther } from 'ethers/lib/utils';
	import { onMount } from 'svelte';
	import TipJarABI from '../artifacts/src/contracts/TipJar.sol/TipJar.json';

	// this can be handled by an svelte store in a better way
	let userAddress = null;
	let provider = null;
	let network = null;
	let balance = null;
	let isConnected = false;
	let contractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'; //this can be an ENS
	let contract = null;
	let tipContract = null;

	async function setupContract() {
		if (isConnected && provider) {
			contract = new ethers.Contract(contractAddress, TipJarABI.abi, provider);
			tipContract = new ethers.Contract(contractAddress, TipJarABI.abi, provider.getSigner());
		}
	}

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
				isConnected = true;
				setupContract();
				await addEthereumListeners();
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

	async function sendTip(event) {
		const formData = new FormData(event.target);
		const data = {};
		for (let field of formData) {
			const [key, value] = field;
			data[key] = value;
		}
		const transaction = await tipContract.sendTip(data.message, data.name, { value: data.amount });
		await transaction.wait();
		alert('Tip Sent!');
	}
	// Let's avoid clicking connect every time and check if the wallet was already connected
	onMount(async () => {
		if (window.ethereum) {
			const accounts = await window.ethereum.request({ method: 'eth_accounts' }); // get the accounts
			if (accounts.length > 0) {
				// it returns an array of accounts, it should have at least 1 element
				userAddress = accounts[0]; // update the state
				// Get and update the ethereum provider
				provider = new ethers.providers.Web3Provider(window.ethereum);
				network = await provider.getNetwork();
				balance = await provider.getBalance(userAddress);
				isConnected = true;
				setupContract();
				await addEthereumListeners();
			}
		}
	});
</script>

<h1 class="text-3xl text-gray-800 p-8">Welcome to my Eth Tip Jar</h1>

{#if isConnected}
	<p class="text-xl text-green-600">
		Successfullly connected with account: <strong>{userAddress}</strong>
	</p>
	<ul>
		<li>Current Network: {network.name}</li>
		<li>Your current balance: {formatEther(balance)} eth</li>
	</ul>

	<form
		class="w-2/3 mx-auto border rounded-md border-indigo-200 flex flex-col gap-8 p-6 mt-4"
		on:submit|preventDefault={sendTip}
	>
		<div class="grid grid-cols-2">
			<label for="tipAmount"> Send me an ethereum tip! </label>
			<input type="string" name="amount" placeholder="0.001" />
		</div>
		<div class="grid grid-cols-2">
			<label for="tipName"> Your name </label>
			<input type="text" name="name" placeholder="Name" />
		</div>
		<div class="grid grid-cols-2">
			<label for="tipMessage"> A quick message </label>
			<input type="text" name="message" placeholder="Message" />
		</div>
		<button
			type="submit"
			class="bg-green-500 text-gray-50 shadow-md rounded-md px-2 py-2 text-center w-1/3 self-center hover:bg-green-600"
			>Send a tip!</button
		>
	</form>
{:else}
	<button
		on:click={connectWallet}
		class="bg-blue-600 text-gray-50 shadow-md rounded-md px-3 py-8 text-center"
		>Connect with Wallet</button
	>
{/if}
