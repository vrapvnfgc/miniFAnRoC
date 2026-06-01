<script lang="ts">
	import DashboardIcon from '@tabler/icons-svelte/icons/dashboard';
	import SettingsIcon from '@tabler/icons-svelte/icons/settings';
	import UsersGroupIcon from '@tabler/icons-svelte/icons/users-group';
	import CalendarEventIcon from '@tabler/icons-svelte/icons/calendar-event';
	import InnerShadowTopIcon from '@tabler/icons-svelte/icons/inner-shadow-top';
	import NavMain from './nav-main.svelte';
	import NavSecondary from './nav-secondary.svelte';
	import NavUser from './nav-user.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';

	const data = {
		user: {
			name: 'shadcn',
			email: 'm@example.com',
			avatar: '/avatars/shadcn.jpg'
		},
		navMain: [
			{
				title: 'Dashboard',
				url: '/admin',
				icon: DashboardIcon
			},
			{
				title: 'Teams',
				url: '/admin/teams',
				icon: UsersGroupIcon
			},
			{
				title: 'Matches',
				url: '/admin/matches',
				icon: CalendarEventIcon
			}
		],
		navSecondary: [
			{
				title: 'Settings',
				url: '#',
				icon: SettingsIcon
			}
		]
	};

	let { ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root collapsible="offcanvas" {...restProps}>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton class="data-[slot=sidebar-menu-button]:!p-1.5">
					{#snippet child({ props })}
						<a href="/admin" {...props}>
							<InnerShadowTopIcon class="!size-5" />
							<span class="text-base font-semibold">miniFAnRoC</span>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={data.navMain} />
		<NavSecondary items={data.navSecondary} class="mt-auto" />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser user={data.user} />
	</Sidebar.Footer>
</Sidebar.Root>
