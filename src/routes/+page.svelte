<script lang="ts">
	import HeroSection from '$lib/components/sections/HeroSection.svelte';
	import TeamsSection from '$lib/components/sections/TeamsSection.svelte';
	import Timeline from '$lib/components/sections/Timeline.svelte';
	import AwardsSection from '$lib/components/sections/AwardsSection.svelte';
	import SponsorCarousel from '$lib/components/sections/SponsorCarousel.svelte';
	import CTASection from '$lib/components/sections/CTASection.svelte';
</script>

<svelte:head>
	<title>miniFAnRoC 2025 — Mini FPT Automation & Robotics Competition</title>
	<meta name="description" content="miniFAnRoC 2025 - Vietnam's premier student robotics and automation competition organized by FPT University." />
</svelte:head>

<HeroSection />
<TeamsSection />
<Timeline />
<AwardsSection />
<CTASection />
<SponsorCarousel />
