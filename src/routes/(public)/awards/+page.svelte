<script lang="ts">
	import PlaceholderPage from '$lib/components/layout/PlaceholderPage.svelte';
</script>

<PlaceholderPage
	title={{
		en: 'Awards',
		vi: 'Giải thưởng'
	}}
	description={{
		en: 'Award details and official award reports will be published here. Each competition page already includes an Award Report tab for event-level reporting.',
		vi: 'Thông tin giải thưởng và báo cáo giải thưởng chính thức sẽ được đăng tại đây. Mỗi trang giải đấu hiện đã có tab Award Report cho báo cáo theo từng sự kiện.'
	}}
	items={[
		{
			en: 'Official award categories',
			vi: 'Các hạng mục giải thưởng chính thức'
		},
		{
			en: 'Event-level award reports',
			vi: 'Báo cáo giải thưởng theo từng giải đấu'
		},
		{
			en: 'Judging notes and publication timeline',
			vi: 'Ghi chú chấm giải và thời gian công bố'
		}
	]}
/>
