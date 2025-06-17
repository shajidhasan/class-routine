<script lang="ts">
	import type { Section } from '$lib/types';

	interface Props {
		currentSection: Section;
		onSectionChange: (section: Section) => void;
	}

	let { currentSection, onSectionChange }: Props = $props();
</script>

<div class="mb-10 flex items-center gap-4 px-6">
	<div class="flex w-full items-center gap-1 bg-gray-800 p-1">
		{#each ['A', 'B', 'C'] as section}
			<button
				onclick={() => onSectionChange(section as Section)}
				class="flex-1 px-4 py-1.5 text-sm font-semibold
					{currentSection === section ? 'bg-primary-600 text-white' : 'text-gray-400'}"
			>
				{#if currentSection === section}
					<span>Section </span>
				{/if}
				{section}
			</button>
		{/each}
	</div>
</div>
