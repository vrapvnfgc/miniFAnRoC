<script lang="ts">
	import ComingSoon from '$lib/components/layout/ComingSoon.svelte';
	import * as m from '$lib/paraglide/messages';
</script>

<ComingSoon title={m.placeholder_matches_title()} description={m.placeholder_matches_desc()} />
