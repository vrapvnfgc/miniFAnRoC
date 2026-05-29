<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import * as Card from '$lib/components/ui/card';
	import * as Field from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import * as Alert from '$lib/components/ui/alert';
	import Warning from 'phosphor-svelte/lib/Warning';

	let { form } = $props();

	const redirectTo = page.url.searchParams.get('redirectTo') || '';

	let email = $state('');
	let password = $state('');
	let validationError = $state('');
</script>

<svelte:head>
	<title>Sign In - miniFAnRoC</title>
	<meta name="description" content="Secure authentication portal" />
</svelte:head>

<div
	class="flex min-h-screen items-center justify-center bg-radial from-neutral-50 to-neutral-200 px-4 dark:from-neutral-900 dark:to-black"
>
	<Card.Root
		class="w-full max-w-md overflow-hidden rounded-2xl border-neutral-200/80 bg-white/70 shadow-xl backdrop-blur-xl transition-all duration-300 dark:border-neutral-800/80 dark:bg-neutral-900/60"
	>
		<form method="POST" action={`?/login&redirectTo=${encodeURIComponent(redirectTo)}`} use:enhance>
			<Card.Header class="text-center">
				<Card.Title class="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
					Welcome back
				</Card.Title>
				<Card.Description class="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
					Enter your details to sign in
				</Card.Description>
			</Card.Header>

			<Card.Content class="flex flex-col gap-4">
				{#if form?.error || validationError}
					<Alert.Root variant="destructive" class="rounded-lg">
						<Warning data-slot="icon" />
						<Alert.Title>Error</Alert.Title>
						<Alert.Description>{form?.error || validationError}</Alert.Description>
					</Alert.Root>
				{/if}

				<Field.FieldGroup class="flex flex-col gap-4">
					<Field.Field>
						<Field.FieldLabel
							for="email"
							class="text-xs font-semibold tracking-wider text-neutral-500 uppercase dark:text-neutral-400"
						>
							Email Address
						</Field.FieldLabel>
						<Input
							type="email"
							id="email"
							name="email"
							bind:value={email}
							required
							placeholder="you@example.com"
							class="w-full rounded-lg border border-neutral-300 bg-white/50 dark:border-neutral-700 dark:bg-neutral-800/40"
						/>
					</Field.Field>

					<Field.Field>
						<div class="flex w-full items-center justify-between">
							<Field.FieldLabel
								for="password"
								class="text-xs font-semibold tracking-wider text-neutral-500 uppercase dark:text-neutral-400"
							>
								Password
							</Field.FieldLabel>
							<a
								href="#forgot"
								class="text-xs text-neutral-400 transition-colors hover:text-neutral-900 dark:hover:text-white"
							>
								Forgot Password?
							</a>
						</div>
						<Input
							type="password"
							id="password"
							name="password"
							bind:value={password}
							required
							placeholder="••••••••"
							class="w-full rounded-lg border border-neutral-300 bg-white/50 dark:border-neutral-700 dark:bg-neutral-800/40"
						/>
					</Field.Field>
				</Field.FieldGroup>
			</Card.Content>

			<Card.Footer class="flex flex-col gap-4">
				<Button
					type="submit"
					class="w-full rounded-lg bg-neutral-900 text-white transition-all hover:bg-neutral-800 active:scale-[0.98] dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
				>
					Sign In
				</Button>
			</Card.Footer>
		</form>
	</Card.Root>
</div>
