<script lang="ts">
	import PlaceholderPage from '$lib/components/layout/PlaceholderPage.svelte';
</script>

<PlaceholderPage
	title={{
		en: 'Team Resources Guide',
		vi: 'Hướng dẫn tài nguyên đội thi'
	}}
	description={{
		en: 'This guide will collect templates, preparation checklists, engineering notebook guidance, and team operation resources for participating teams.',
		vi: 'Trang này sẽ tổng hợp biểu mẫu, checklist chuẩn bị, hướng dẫn nhật ký kỹ thuật và tài nguyên vận hành đội cho các đội tham gia.'
	}}
	items={[
		{
			en: 'Team registration and document checklist',
			vi: 'Checklist đăng ký đội và hồ sơ cần nộp'
		},
		{
			en: 'Engineering notebook and presentation guidance',
			vi: 'Hướng dẫn nhật ký kỹ thuật và thuyết trình'
		},
		{
			en: 'Practice, logistics, and event-day preparation resources',
			vi: 'Tài nguyên luyện tập, hậu cần và chuẩn bị ngày thi'
		}
	]}
/>
