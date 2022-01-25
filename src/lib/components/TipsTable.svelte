<script>
	export let tips = [];
</script>

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
		{#each tips as item}
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
