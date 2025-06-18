<script lang="ts">
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	interface BeforeInstallPromptEvent extends Event {
		readonly platforms: Array<string>;
		readonly userChoice: Promise<{
			outcome: 'accepted' | 'dismissed';
			platform: string;
		}>;
		prompt(): Promise<void>;
	}

	let deferredPrompt: BeforeInstallPromptEvent | null = null;
	let installButtonVisible: boolean = $state(false);
	let isPWAInstalled: boolean = false;

	onMount(() => {
		if (window.matchMedia('(display-mode: standalone)').matches) {
			isPWAInstalled = true;
		} else if ((navigator as any).standalone) {
			isPWAInstalled = true;
		}
	});

	const beforeInstallPrompt = async (e: Event) => {
		const event = e as BeforeInstallPromptEvent;
		event.preventDefault();
		deferredPrompt = event;
		if (!isPWAInstalled) {
			installButtonVisible = true;
		}
	};

	const handleInstallApp = async (): Promise<void> => {
		if (deferredPrompt) {
			deferredPrompt.prompt();
			const { outcome } = await deferredPrompt.userChoice;
			deferredPrompt = null;
			installButtonVisible = false;
			if (outcome === 'accepted') {
				isPWAInstalled = true;
			}
		}
	};

	const handleDismiss = () => {
		installButtonVisible = false;
	};
</script>

<svelte:window onbeforeinstallprompt={beforeInstallPrompt} />

{#if installButtonVisible}
	<div class="border-b border-gray-700 bg-gray-900 shadow-lg" transition:slide>
		<div class="container mx-auto px-6">
			<div class="flex items-center justify-between gap-4 py-3">
				<div class="flex items-center gap-4">
					<div class="flex-shrink-0">
						<svg
							class="h-8 w-8 text-gray-500"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M9 12l3 3m0 0l3-3m-3 3V2.25"
							/>
						</svg>
					</div>
					<div>
						<p class="font-semibold text-white">Install App for Faster Access</p>
						<p class="text-sm text-gray-400">Add to your home screen for a native experience.</p>
					</div>
				</div>

				<div class="flex flex-shrink-0 items-center gap-2">
					<button
						class="bg-primary-600 hover:bg-primary-700 focus-visible:ring-primary-500 inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 focus-visible:outline-none"
						onclick={handleInstallApp}
					>
						Install
					</button>

					<button
						aria-label="Dismiss"
						class="p-2 text-gray-500 transition-colors hover:bg-gray-800 hover:text-gray-300 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none"
						onclick={handleDismiss}
					>
						<svg
							class="h-5 w-5"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
