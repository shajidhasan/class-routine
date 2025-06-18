<script lang="ts">
	import type { ClassItem } from '$lib/types';

	interface Props {
		classItem: ClassItem;
		isCurrentClass?: boolean;
		showTeachers?: boolean;
		progress?: number;
	}

	let { classItem, isCurrentClass = false, showTeachers = false, progress }: Props = $props();

	const cardClasses = $derived(`
		relative w-60 flex-shrink-0 overflow-hidden p-3 pb-4 snap-start
		${
			isCurrentClass
				? 'bg-green-900/50 border-2 border-green-500 shadow-lg shadow-green-900/50 current-class'
				: 'bg-gray-800 border border-gray-700 hover:border-gray-600'
		}
	`);
</script>

<div class={cardClasses}>
	<div class="relative flex h-full flex-col">
		<div class="flex items-start justify-between">
			<div
				class:text-primary-400={!classItem.sessional}
				class:text-yellow-400={classItem.sessional}
				class="text-sm font-bold"
			>
				{classItem.code}
			</div>
			<div class="font-mono text-xs text-gray-500">{classItem.time}</div>
		</div>

		<div class="mt-3 text-base leading-tight font-semibold text-gray-100">
			{classItem.name}
		</div>

		{#if showTeachers && classItem.teachers.length > 0}
			<div class="mt-auto space-y-1 pt-3">
				{#each classItem.teachers as teacher}
					<div class="text-xs text-gray-400">{teacher}</div>
				{/each}
			</div>
		{/if}
	</div>

	{#if isCurrentClass && progress !== undefined}
		<div class="absolute bottom-0 left-0 h-1 w-full bg-green-400/20">
			<div class="h-full bg-green-400" style="width: {progress}%"></div>
		</div>
	{/if}
</div>
