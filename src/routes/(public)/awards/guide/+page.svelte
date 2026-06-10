<script lang="ts">
	import PlaceholderPage from '$lib/components/layout/PlaceholderPage.svelte';
</script>

<PlaceholderPage
	title={{
		en: 'Awards Explanation Guide',
		vi: 'Hướng dẫn giải thích giải thưởng'
	}}
	description={{
		en: 'This page will explain award criteria, judging expectations, and how teams can prepare evidence for each award category.',
		vi: 'Trang này sẽ giải thích tiêu chí giải thưởng, kỳ vọng chấm giải và cách các đội chuẩn bị minh chứng cho từng hạng mục.'
	}}
	items={[
		{
			en: 'Award criteria and judging rubric',
			vi: 'Tiêu chí giải thưởng và rubric chấm giải'
		},
		{
			en: 'Evidence teams should prepare',
			vi: 'Các minh chứng đội nên chuẩn bị'
		},
		{
			en: 'How award reports are reviewed and published',
			vi: 'Cách báo cáo giải thưởng được rà soát và công bố'
		}
	]}
/>
