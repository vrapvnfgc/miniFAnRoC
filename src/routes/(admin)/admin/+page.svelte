<script lang="ts">
	import { Button } from '$lib/components/ui/button';
</script>

<div class="@container/main flex flex-1 flex-col gap-2">
	<div class="flex flex-col gap-6 py-4 md:gap-8 md:py-6 px-4 md:px-6">
		<div>
			<h1 class="text-3xl font-bold mb-2">Admin Dashboard</h1>
			<p class="text-muted-foreground">Manage your robotics competition data</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			<a href="/admin/matches" class="block">
				<Button class="w-full h-32 text-lg font-semibold" variant="outline">
					<div class="flex flex-col items-center gap-2">
						<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<circle cx="12" cy="12" r="1"/><path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24"/>
						</svg>
						Matches
					</div>
				</Button>
			</a>

			<a href="/admin/teams" class="block">
				<Button class="w-full h-32 text-lg font-semibold" variant="outline">
					<div class="flex flex-col items-center gap-2">
						<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
						</svg>
						Teams
					</div>
				</Button>
			</a>

			<a href="/admin/users" class="block">
				<Button class="w-full h-32 text-lg font-semibold" variant="outline">
					<div class="flex flex-col items-center gap-2">
						<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
						</svg>
						Users
					</div>
				</Button>
			</a>
		</div>
	</div>
</div>
