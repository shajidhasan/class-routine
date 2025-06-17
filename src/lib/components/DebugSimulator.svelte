<script lang="ts">
	import { formatTimeFromMinutes, formatTime } from '$lib/utils';
	import { dayLabels } from '$lib/data';

	interface Props {
		isDebugModeEnabled: boolean;
		isSimulating: boolean;
		simulatedDay: number;
		simulatedTimeMinutes: number;
		currentTime: Date;
		onToggleSimulating: (value: boolean) => void;
		onUpdateSimulatedDay: (day: number) => void;
		onUpdateSimulatedTime: (minutes: number) => void;
	}

	let {
		isDebugModeEnabled,
		isSimulating,
		simulatedDay,
		simulatedTimeMinutes,
		currentTime,
		onToggleSimulating,
		onUpdateSimulatedDay,
		onUpdateSimulatedTime
	}: Props = $props();
</script>

{#if isDebugModeEnabled}
	<div class="fixed top-0 right-0 left-0 z-50 bg-gray-950/80 backdrop-blur-sm">
		<div class="border-b border-gray-800">
			<div class="container mx-auto px-6">
				<div class="flex flex-col gap-3 py-4">
					<div class="flex items-center justify-between">
						<div class="text-sm font-bold tracking-wider text-gray-200">TIME SIMULATOR</div>
						<label class="flex cursor-pointer items-center gap-2">
							<input
								type="checkbox"
								checked={isSimulating}
								onchange={(e) => onToggleSimulating(e.currentTarget.checked)}
								class="text-primary-500 focus:ring-primary-500 h-4 w-4 rounded-sm border-gray-600 bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950"
							/>
							<span class="text-sm font-semibold text-gray-300">SIMULATE</span>
						</label>
					</div>

					{#if isSimulating}
						<div class="flex flex-col gap-4">
							<div class="flex items-center gap-2">
								<p class="text-sm font-bold text-gray-400">DAY:</p>
								<select
									value={simulatedDay}
									onchange={(e) => onUpdateSimulatedDay(parseInt(e.currentTarget.value))}
									class="focus:border-primary-500 focus:ring-primary-500 rounded-md border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm text-gray-100"
								>
									{#each dayLabels as day, index}
										<option value={index}>{day}</option>
									{/each}
								</select>
							</div>

							<div class="flex items-center gap-4">
								<input
									type="range"
									min="500"
									max="1200"
									step="1"
									value={simulatedTimeMinutes}
									oninput={(e) => onUpdateSimulatedTime(parseInt(e.currentTarget.value))}
									class="flex-1"
								/>
								<div
									class="min-w-[70px] rounded-md bg-gray-800 py-1 text-center text-sm font-bold text-gray-100"
								>
									{formatTimeFromMinutes(simulatedTimeMinutes)}
								</div>
							</div>
						</div>
					{:else}
						<div class="text-sm text-gray-500">
							LIVE: <span class="font-bold text-gray-200">{formatTime(currentTime)}</span>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}
