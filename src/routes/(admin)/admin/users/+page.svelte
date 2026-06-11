<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let isCreateSheetOpen = $state(false);
	let isEditSheetOpen = $state(false);
	let showDeleteConfirm = $state(false);
	let deleteUserId = $state<string | null>(null);
	let deleteUserName = $state('');
	let editingUser = $state<any>(null);

	// Form fields
	let formName = $state('');
	let formEmail = $state('');
	let formPassword = $state('');
	let formRole = $state('USER');

	function openCreateSheet() {
		formName = '';
		formEmail = '';
		formPassword = '';
		formRole = 'USER';
		isCreateSheetOpen = true;
	}

	function openEditSheet(user: any) {
		editingUser = user;
		formName = user.name;
		formEmail = user.email;
		formPassword = ''; // Don't show existing password
		formRole = user.role;
		isEditSheetOpen = true;
	}

	function closeSheets() {
		isCreateSheetOpen = false;
		isEditSheetOpen = false;
	}

	function openDeleteConfirm(user: any) {
		deleteUserId = user.id;
		deleteUserName = user.name;
		showDeleteConfirm = true;
	}

	function closeDeleteConfirm() {
		showDeleteConfirm = false;
		deleteUserId = null;
		deleteUserName = '';
	}
</script>

<div class="flex flex-col gap-6 p-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Users</h1>
			<p class="text-muted-foreground">Manage your users here.</p>
		</div>
		<Button onclick={openCreateSheet} size="lg">+ Add User</Button>
	</div>

	{#if data.error}
		<div class="rounded-md border border-red-200 bg-red-50 p-4 text-red-800">
			<p class="font-medium">{data.error}</p>
		</div>
	{/if}

	<div class="overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 shadow-lg">
		<Table.Root>
			<Table.Header>
				<Table.Row class="border-b border-zinc-700 bg-zinc-800/70">
					<Table.Head class="font-semibold text-zinc-100">Name</Table.Head>
					<Table.Head class="font-semibold text-zinc-100">Email</Table.Head>
					<Table.Head class="font-semibold text-zinc-100">Role</Table.Head>
					<Table.Head class="text-right font-semibold text-zinc-100">Actions</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.users as user (user.id)}
					<Table.Row class="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
						<Table.Cell class="font-medium text-zinc-100">{user.name}</Table.Cell>
						<Table.Cell class="text-zinc-400">{user.email}</Table.Cell>
						<Table.Cell class="text-zinc-400">
							<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-zinc-800 text-zinc-300">
								{user.role}
							</span>
						</Table.Cell>
						<Table.Cell class="text-right">
							<div class="flex gap-2 justify-end">
								<Button 
									variant="outline" 
									size="sm" 
									onclick={() => openEditSheet(user)}
									class="border-zinc-600 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
								>
									Edit
								</Button>
								<Button 
									variant="destructive" 
									size="sm"
									onclick={() => openDeleteConfirm(user)}
									class="bg-red-600 hover:bg-red-700 text-white"
								>
									Delete
								</Button>
							</div>
						</Table.Cell>
					</Table.Row>
				{/each}
				{#if data.users.length === 0}
					<Table.Row>
						<Table.Cell colspan={4} class="text-center text-zinc-500 py-8">No users found.</Table.Cell>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>
	</div>

	<!-- Delete Confirmation Alert -->
	{#if showDeleteConfirm}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<Alert.Root class="w-96">
				<div class="flex flex-col gap-4">
					<div>
						<h2 class="text-lg font-semibold">Delete User</h2>
						<p class="text-sm text-muted-foreground">Are you sure you want to delete <strong>{deleteUserName}</strong>? This action cannot be undone.</p>
					</div>
					<div class="flex gap-2 justify-end">
						<Button variant="outline" onclick={closeDeleteConfirm}>Cancel</Button>
						<form 
							method="POST" 
							action="?/delete" 
							use:enhance={() => {
								return async ({ result }) => {
									if (result.type === 'success') {
										closeDeleteConfirm();
										await invalidateAll();
									}
								};
							}}
							class="inline"
						>
							<input type="hidden" name="id" value={deleteUserId} />
							<Button variant="destructive" type="submit">Delete</Button>
						</form>
					</div>
				</div>
			</Alert.Root>
		</div>
	{/if}

	<!-- Create Sheet -->
	<Sheet.Root open={isCreateSheetOpen} onOpenChange={(open) => isCreateSheetOpen = open}>
		<Sheet.Content class="w-[400px] sm:w-[540px]">
			<Sheet.Header>
				<Sheet.Title>Create New User</Sheet.Title>
				<Sheet.Description>
					Add a new user to your system. Fill in all required fields.
				</Sheet.Description>
			</Sheet.Header>

			<form method="POST" action="?/create" use:enhance onsubmit={() => closeSheets()} class="space-y-4 py-4">
				<div class="grid gap-2">
					<Label for="name">Name *</Label>
					<Input id="name" name="name" bind:value={formName} required />
				</div>

				<div class="grid gap-2">
					<Label for="email">Email *</Label>
					<Input id="email" name="email" type="email" bind:value={formEmail} required />
				</div>
				
				<div class="grid gap-2">
					<Label for="password">Password *</Label>
					<Input id="password" name="password" type="password" bind:value={formPassword} required minlength={8} />
				</div>

				<div class="grid gap-2">
					<Label for="role">Role *</Label>
					<Select.Root type="single" name="role" bind:value={formRole}>
						<Select.Trigger class="w-full">
							{formRole}
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="USER">USER</Select.Item>
							<Select.Item value="ADMIN">ADMIN</Select.Item>
						</Select.Content>
					</Select.Root>
				</div>

				<div class="flex gap-2 pt-4">
					<Button type="button" variant="outline" onclick={closeSheets} class="flex-1">Cancel</Button>
					<Button type="submit" class="flex-1">Create User</Button>
				</div>
			</form>
		</Sheet.Content>
	</Sheet.Root>

	<!-- Edit Sheet -->
	<Sheet.Root open={isEditSheetOpen} onOpenChange={(open) => isEditSheetOpen = open}>
		<Sheet.Content class="w-[400px] sm:w-[540px]">
			<Sheet.Header>
				<Sheet.Title>Edit User</Sheet.Title>
				<Sheet.Description>
					Update the user information.
				</Sheet.Description>
			</Sheet.Header>

			{#if editingUser}
				<form method="POST" action="?/update" use:enhance onsubmit={() => closeSheets()} class="space-y-4 py-4">
					<input type="hidden" name="id" value={editingUser.id} />

					<div class="grid gap-2">
						<Label for="editName">Name *</Label>
						<Input id="editName" name="name" bind:value={formName} required />
					</div>

					<div class="grid gap-2">
						<Label for="editEmail">Email *</Label>
						<Input id="editEmail" name="email" type="email" bind:value={formEmail} required />
					</div>
					
					<div class="grid gap-2">
						<Label for="editPassword">Password (leave blank to keep unchanged)</Label>
						<Input id="editPassword" name="password" type="password" bind:value={formPassword} minlength={8} />
					</div>

					<div class="grid gap-2">
						<Label for="editRole">Role *</Label>
						<Select.Root type="single" name="role" bind:value={formRole}>
							<Select.Trigger class="w-full">
								{formRole}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="USER">USER</Select.Item>
								<Select.Item value="ADMIN">ADMIN</Select.Item>
							</Select.Content>
						</Select.Root>
					</div>

					<div class="flex gap-2 pt-4">
						<Button type="button" variant="outline" onclick={closeSheets} class="flex-1">Cancel</Button>
						<Button type="submit" class="flex-1">Update User</Button>
					</div>
				</form>
			{/if}
		</Sheet.Content>
	</Sheet.Root>
</div>
