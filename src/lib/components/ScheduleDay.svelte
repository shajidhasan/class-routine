<script lang="ts">
	import type { ScheduleDay } from '$lib/types';
	import SpecialClassCard from '$lib/components/SpecialClassCard.svelte';
	import GenericClassCard from '$lib/components/GenericClassCard.svelte';
	import BreakCard from '$lib/components/BreakCard.svelte';

	interface Props {
		day: ScheduleDay;
	}

	let { day }: Props = $props();
</script>

<section>
	<div class="mb-6 flex items-center gap-3">
		<h2
			class="px-6 {day.highlight
				? 'text-2xl text-gray-100'
				: 'text-xl text-gray-400'} font-semibold"
		>
			{day.title}
		</h2>
	</div>

	{#if day.isOffDay}
		<div class="px-6">
			<div class="flex gap-4 border border-dashed border-gray-700 bg-gray-800/50 p-4">
				<div class="text-2xl">🎉</div>
				<div>
					<div class="text-lg font-semibold text-gray-200">No Classes</div>
					<div class="text-sm text-gray-400">Enjoy your day off!</div>
				</div>
			</div>
		</div>
	{:else}
		{#if day.status?.status === 'break'}
			<BreakCard nextClass={day.classes[day.status.nextIndex!]} progress={day.status.progress} />
		{/if}
		<div
			class="scrollbar-hidden flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 pb-4"
		>
			{#if day.highlight}
				{#each day.classes as classItem, index}
					{@const isCurrentClass = day.status?.status === 'ongoing' && day.status?.index === index}

					<SpecialClassCard
						{classItem}
						{isCurrentClass}
						showTeachers={day.highlight}
						progress={day.status?.progress}
					/>
				{/each}
			{:else}
				{#each day.classes as classItem}
					<GenericClassCard {classItem} />
				{/each}
			{/if}
		</div>
	{/if}
</section>
