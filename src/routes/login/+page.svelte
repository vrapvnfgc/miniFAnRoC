<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Card from '$lib/components/ui/card';

	let { form } = $props();
</script>

<svelte:head>
	<title>Admin Login - miniFAnRoC</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
	<Card.Root class="w-full max-w-md bg-zinc-900 border-zinc-800 text-zinc-100">
		<Card.Header class="space-y-1">
			<Card.Title class="text-2xl font-bold tracking-tight text-center">Admin Login</Card.Title>
			<Card.Description class="text-center text-zinc-400">
				Enter your credentials to access the dashboard
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<form method="POST" use:enhance class="space-y-4">
				{#if form?.error}
					<div class="p-3 text-sm bg-red-950/50 border border-red-900 text-red-500 rounded-md text-center">
						{form.error}
					</div>
				{/if}
				
				<div class="space-y-2">
					<label for="email" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
						Email
					</label>
					<Input 
						id="email" 
						name="email" 
						type="email" 
						placeholder="admin@example.com" 
						required 
						class="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-500"
					/>
				</div>
				<div class="space-y-2">
					<label for="password" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
						Password
					</label>
					<Input 
						id="password" 
						name="password" 
						type="password" 
						required 
						class="bg-zinc-950 border-zinc-800 text-white"
					/>
				</div>
				
				<Button type="submit" class="w-full bg-white text-black hover:bg-zinc-200">
					Sign In
				</Button>
			</form>
		</Card.Content>
	</Card.Root>
</div>
