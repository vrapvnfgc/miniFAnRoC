<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import HeroSection from '$lib/components/homepage/HeroSection.svelte';
	import AboutSection from '$lib/components/homepage/AboutSection.svelte';
	import StatisticsSection from '$lib/components/homepage/StatisticsSection.svelte';
	import TimelineSection from '$lib/components/homepage/TimelineSection.svelte';
	import VietnamMapSection from '$lib/components/homepage/VietnamMapSection.svelte';
	import DivisionsSection from '$lib/components/homepage/DivisionsSection.svelte';
	import MatchesSection from '$lib/components/homepage/MatchesSection.svelte';
	import CTASection from '$lib/components/homepage/CTASection.svelte';
	import SponsorsSection from '$lib/components/homepage/SponsorsSection.svelte';
</script>

<svelte:head>
	<title>{m.page_title()}</title>
	<meta name="description" content={m.page_description()} />
</svelte:head>

<HeroSection />
<AboutSection />
<StatisticsSection />
<TimelineSection />
<VietnamMapSection />
<DivisionsSection />
<MatchesSection />
<CTASection />
<SponsorsSection />
