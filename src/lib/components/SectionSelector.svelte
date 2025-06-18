<script lang="ts">
	import type { Section } from '$lib/types';

	interface Props {
		currentSection: Section;
		onSectionChange: (section: Section) => void;
	}

	let { currentSection, onSectionChange }: Props = $props();

	const sections = ['A', 'B', 'C'] as const;
	let currentIndex = $derived(sections.indexOf(currentSection));
</script>

<div class="mb-10 px-6">
	<div class="relative flex w-full bg-gray-800 p-1">
		<div
			class="bg-primary-600/50 absolute top-1 bottom-1 transition-all duration-300 ease-in-out"
			style="width: calc(100% / {sections.length}); left: {currentIndex *
				(100 / sections.length)}%;"
		></div>

		{#each sections as section (section)}
			<button
				onclick={() => onSectionChange(section)}
				class="relative z-10 flex-1 px-4 py-1.5 text-sm font-semibold transition-colors duration-300"
				class:text-white={currentSection === section}
				class:text-gray-400={currentSection !== section}
			>
				Section {section}
			</button>
		{/each}
	</div>
</div>
