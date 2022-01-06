<script>
	let userAddress = null;

	async function connectWallet() {
		if (window.ethereum) {
			// ethereum is an object injected by the wallet. Let's check if is available
			const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }); // use the request method to get the accounts, aka logging in to Metamask
			if (accounts.length > 0) {
				// it returns an array of accounts, it should have at least 1 element
				userAddress = accounts[0]; // update the state
			} else {
				alert('No ethereum accounts found');
			}
		} else {
			alert('No ethereum Wallet found');
		}
	}
</script>

<h1 class="text-3xl text-gray-800 p-8">Welcome to my Eth Tip Jar</h1>

{#if userAddress}
	<p class="text-xl text-green-600">
		Successfullly connected with account: <strong>{userAddress}</strong>
	</p>
{:else}
	<button
		on:click={connectWallet}
		class="bg-blue-600 text-gray-50 shadow-md rounded-md px-3 py-8 text-center"
		>Connect with Wallet</button
	>
{/if}
