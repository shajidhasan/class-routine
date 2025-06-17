<script lang="ts">
	import type { ClassItem } from '$lib/types';
	import { slide } from 'svelte/transition';

	interface Props {
		nextClass?: ClassItem;
		progress?: number;
	}

	let { nextClass, progress }: Props = $props();
</script>

<div class="px-6 pb-6" transition:slide>
	<section
		class="relative flex w-full gap-2 overflow-hidden border-2 border-dashed border-sky-500 bg-sky-950/50 p-2 pb-3"
	>
		<span class="text-2xl"> ☕️ </span>
		<div class="">
			<span> Break Time</span>
			<p class="text-sm text-sky-400">
				Next up: <span class="font-medium">{nextClass?.code || 'Unknown'}</span>
			</p>
		</div>

		{#if progress !== undefined}
			<div class="absolute bottom-0 left-0 h-1 w-full bg-sky-400/20">
				<div class="h-full bg-sky-400" style="width: {progress}%"></div>
			</div>
		{/if}
	</section>
</div>
