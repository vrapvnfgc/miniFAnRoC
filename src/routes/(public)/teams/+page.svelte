<script lang="ts">
	import PlaceholderPage from '$lib/components/layout/PlaceholderPage.svelte';
</script>

<PlaceholderPage
	title={{
		en: 'Team List',
		vi: 'Danh sách đội'
	}}
	description={{
		en: 'The public team directory is being prepared. Team profile pages are already available when opening a specific team number.',
		vi: 'Danh sách đội công khai đang được chuẩn bị. Trang hồ sơ đội đã có thể truy cập khi mở một mã đội cụ thể.'
	}}
	items={[
		{
			en: 'Searchable public team directory',
			vi: 'Danh sách đội công khai có thể tìm kiếm'
		},
		{
			en: 'Team profile, rankings, and match history',
			vi: 'Hồ sơ đội, xếp hạng và lịch sử trận đấu'
		}
	]}
	primaryAction={{
		href: '/auth',
		label: {
			en: 'Register a team',
			vi: 'Đăng ký đội'
		}
	}}
/>
