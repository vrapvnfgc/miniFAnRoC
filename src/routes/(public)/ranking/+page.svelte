<script lang="ts">
	import PlaceholderPage from '$lib/components/layout/PlaceholderPage.svelte';
</script>

<PlaceholderPage
	title={{
		en: 'Ranking',
		vi: 'Bảng xếp hạng'
	}}
	description={{
		en: 'The global ranking page is being prepared. For now, rankings are available inside each competition page.',
		vi: 'Trang bảng xếp hạng tổng đang được chuẩn bị. Hiện tại, bảng xếp hạng đã có trong từng trang giải đấu.'
	}}
	items={[
		{
			en: 'Competition-specific rankings',
			vi: 'Bảng xếp hạng theo từng giải đấu'
		},
		{
			en: 'Ranking score, matches played, and highest match score',
			vi: 'Điểm xếp hạng, số trận đã tính và điểm trận cao nhất'
		}
	]}
	primaryAction={{
		href: '/competitions',
		label: {
			en: 'View competitions',
			vi: 'Xem các giải đấu'
		}
	}}
/>
