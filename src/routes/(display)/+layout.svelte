<script lang="ts">
	let { children } = $props();
	
	let scale = $state(1);

	function updateScale() {
		const width = window.innerWidth;
		const height = window.innerHeight;
		scale = Math.min(width / 1920, height / 1080);
	}

	$effect(() => {
		updateScale();
		window.addEventListener('resize', updateScale);
		return () => window.removeEventListener('resize', updateScale);
	});
</script>

<div class="fixed inset-0 flex items-center justify-center overflow-hidden bg-black text-white">
	<div 
		class="relative origin-center bg-background text-foreground overflow-hidden"
		style="width: 1920px; height: 1080px; transform: scale({scale});"
	>
		{@render children()}
	</div>
</div>
