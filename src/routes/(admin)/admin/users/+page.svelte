<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="flex flex-col gap-6 p-6">
	<div>
		<h1 class="text-2xl font-bold tracking-tight">Users</h1>
		<p class="text-muted-foreground">Manage your users here.</p>
	</div>

	<div class="rounded-md border">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Name</Table.Head>
					<Table.Head>Email</Table.Head>
					<Table.Head>Role</Table.Head>
					<Table.Head class="text-right">Actions</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.users as user (user.id)}
					<Table.Row>
						<Table.Cell class="font-medium">{user.name}</Table.Cell>
						<Table.Cell>{user.email}</Table.Cell>
						<Table.Cell>{user.role}</Table.Cell>
						<Table.Cell class="text-right">
							<form method="POST" action="?/delete" class="inline">
								<input type="hidden" name="id" value={user.id} />
								<Button variant="destructive" size="sm" type="submit">Delete</Button>
							</form>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>

	<div class="rounded-md border p-4">
		<h2 class="mb-4 text-lg font-semibold">Add User</h2>
		<form method="POST" action="?/create" class="flex flex-col gap-4 max-w-sm">
			<div class="grid gap-2">
				<Label for="name">Name</Label>
				<Input id="name" name="name" required />
			</div>
			<div class="grid gap-2">
				<Label for="email">Email</Label>
				<Input id="email" name="email" type="email" required />
			</div>
			<Button type="submit">Create User</Button>
		</form>
	</div>
</div>
