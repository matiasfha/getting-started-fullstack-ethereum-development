<script>
    let userAddress = null;

    async function connectWallet() {
        if(window.ethereum) {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts'})
            if(accounts.length > 0) {
                userAddress = accounts[0]
            }else{
                alert('No accounts found')
            }
        }else{
            alert('No ethereum wallet found')
        }
    }

</script>

{#if userAddress}
    <p class="text-xl text-green-600">
        Successfully connected with account <strong>{userAddress}</strong>
    </p>
{:else}
    <button class="bg-blue-600 text-gray-50 shadow-md rounded-md px-3 py-8 text-center" on:click={connectWallet}>
        Connect with Wallet
    </button>
{/if}