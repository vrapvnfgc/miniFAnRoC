<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import HeroSection from '$lib/components/homepage/HeroSection.svelte';
	import AboutSection from '$lib/components/homepage/AboutSection.svelte';
	import StatisticsSection from '$lib/components/homepage/StatisticsSection.svelte';
	import TimelineSection from '$lib/components/homepage/TimelineSection.svelte';
	import VietnamMapSection from '$lib/components/homepage/VietnamMapSection.svelte';
	import DivisionsSection from '$lib/components/homepage/DivisionsSection.svelte';
	import AwardsSection from '$lib/components/homepage/AwardsSection.svelte';
	import MatchesSection from '$lib/components/homepage/MatchesSection.svelte';
	import CTASection from '$lib/components/homepage/CTASection.svelte';
	import SponsorsSection from '$lib/components/homepage/SponsorsSection.svelte';
</script>

<svelte:head>
	<title>{m.page_title()}</title>
	<meta name="description" content={m.page_description()} />
</svelte:head>

<!-- Root wrapper: light = white bg + dark text, dark = slate-950 bg + white text -->
<div
	class="min-h-screen overflow-x-hidden bg-white text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white"
>
	<Navbar />
	<HeroSection />
	<AboutSection />
	<StatisticsSection />
	<TimelineSection />
	<VietnamMapSection />
	<DivisionsSection />
	<AwardsSection />
	<MatchesSection />
	<CTASection />
	<SponsorsSection />
	<Footer />
</div>
