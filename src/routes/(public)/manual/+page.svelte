<script lang="ts">
	import PlaceholderPage from '$lib/components/layout/PlaceholderPage.svelte';
</script>

<PlaceholderPage
	title={{
		en: 'Competition Manual',
		vi: 'Tài liệu thi đấu'
	}}
	description={{
		en: 'The official competition manual will include game rules, scoring definitions, field setup, inspection flow, and event procedures for FAnRoC teams.',
		vi: 'Tài liệu thi đấu chính thức sẽ bao gồm luật chơi, định nghĩa điểm số, cách bố trí sân, quy trình kiểm tra và quy trình vận hành sự kiện cho các đội FAnRoC.'
	}}
	items={[
		{
			en: 'Game rules and scoring guide',
			vi: 'Luật chơi và hướng dẫn tính điểm'
		},
		{
			en: 'Field setup and match operation notes',
			vi: 'Bố trí sân và ghi chú vận hành trận đấu'
		},
		{
			en: 'Robot inspection and safety requirements',
			vi: 'Kiểm tra robot và yêu cầu an toàn'
		}
	]}
/>
