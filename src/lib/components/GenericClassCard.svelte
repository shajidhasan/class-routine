<script lang="ts">
	import type { ClassItem } from '$lib/types';

	interface Props {
		classItem: ClassItem;
	}

	let { classItem }: Props = $props();
</script>

<div
	class="w-48 flex-shrink-0 snap-start overflow-hidden border border-gray-800 bg-gray-900 p-3 hover:border-gray-600"
>
	<div class="flex h-full flex-col">
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
	</div>
</div>
