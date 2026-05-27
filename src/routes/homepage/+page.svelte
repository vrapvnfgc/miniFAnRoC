<script lang="ts">
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
  <title>miniFAnRoC — FSchool AI and Robotics Challenge</title>
  <meta name="description" content="Vietnam's nationwide STEM, AI and Robotics competition for middle school students. Powered by miniFAnRoC platform." />
</svelte:head>

<!-- Root wrapper: light = white bg + dark text, dark = slate-950 bg + white text -->
<div class="min-h-screen overflow-x-hidden bg-white text-slate-900 dark:bg-slate-950 dark:text-white transition-colors duration-300">
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
