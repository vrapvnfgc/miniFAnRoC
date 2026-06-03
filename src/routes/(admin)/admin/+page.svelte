<script lang="ts">
	import data from './data.js';
	import SectionCards from './components/section-cards.svelte';
	import ChartAreaInteractive from './components/chart-area-interactive.svelte';
	import DataTable from './components/data-table.svelte';
</script>

<div class="@container/main flex flex-1 flex-col gap-2">
	<div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
		<SectionCards />
		<div class="px-4 lg:px-6">
			<ChartAreaInteractive />
		</div>
		<DataTable {data} />
	</div>
</div>
