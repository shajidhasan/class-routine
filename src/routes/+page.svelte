<script lang="ts">
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import type { Section, ScheduleDay, ClassItem } from '$lib/types';
	import { getScheduleData, formatTime, formatDate, formatTimeFromMinutes } from '$lib/utils';
	import { dayLabels } from '$lib/data';

	// STATE
	let currentSection = $state<Section>('A');
	let currentTime = $state<Date>(new Date());
	let isSimulating = $state<boolean>(false);
	let simulatedDay = $state<number>(new Date().getDay());
	let simulatedTimeMinutes = $state<number>(new Date().getHours() * 60 + new Date().getMinutes());

	onMount(() => {
		const savedSection = localStorage.getItem('currentSection') as Section | null;
		if (savedSection && ['A', 'B', 'C'].includes(savedSection)) currentSection = savedSection;

		const interval = setInterval(() => {
			if (!isSimulating) {
				currentTime = new Date();
				simulatedDay = currentTime.getDay();
				simulatedTimeMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
			}
		}, 60000);
		return () => clearInterval(interval);
	});

	function updateSimulatedTime(): void {
		if (isSimulating) {
			const newTime = new Date();
			newTime.setHours(Math.floor(simulatedTimeMinutes / 60), simulatedTimeMinutes % 60, 0, 0);
			const dayDiff = simulatedDay - newTime.getDay();
			newTime.setDate(newTime.getDate() + dayDiff);
			currentTime = newTime;
		}
	}

	$effect(() => {
		updateSimulatedTime();
	});

	$effect(() => {
		localStorage.setItem('currentSection', currentSection);
	});

	function scrollToCurrentClass(): void {
		const currentClassElement = document.querySelector('.current-class');
		if (currentClassElement) {
			currentClassElement.scrollIntoView({
				behavior: 'smooth',
				block: 'nearest',
				inline: 'center'
			});
		}
	}

	$effect(() => {
		getScheduleData(currentTime, currentSection);
		currentTime;
		setTimeout(scrollToCurrentClass, 1000);
	});

	const schedule = $derived(getScheduleData(currentTime, currentSection));
</script>

<main class="relative min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-950">
	<!-- Header -->
	<header class="sticky top-0 z-40 border-b border-zinc-800/60 bg-zinc-900/80 backdrop-blur-xl">
		<div class="px-4 py-4">
			<div class="mb-3 flex items-center justify-between">
				<div>
					<h1 class="mb-1 text-xl font-semibold tracking-tight text-zinc-100">
						ME '20 <span class="rounded-lg bg-zinc-800 px-2 py-1 text-sm">(4-1)</span>
					</h1>
					<p class="text-sm text-zinc-400">{formatDate(currentTime)}</p>
				</div>
				<div
					class="flex items-center gap-2 rounded-full border border-emerald-800/30 bg-emerald-950/50 px-3 py-1.5"
				>
					<div class="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400"></div>
					<span class="text-sm font-medium text-emerald-300">{formatTime(currentTime)}</span>
				</div>
			</div>

			<!-- Section Selector -->
			<div class="mt-2 flex rounded-xl bg-zinc-800 p-1">
				{#each ['A', 'B', 'C'] as section}
					<button
						onclick={() => (currentSection = section as Section)}
						aria-label="Select Section {section}"
						class="flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 {currentSection ===
						section
							? 'bg-zinc-700 text-zinc-100 shadow-sm'
							: 'hover:bg-zinc-750 text-zinc-400 hover:text-zinc-200'}"
					>
						Section {section}
					</button>
				{/each}
			</div>
		</div>
	</header>

	<!-- Schedule -->
	<div class="space-y-8 px-4 py-6">
		{#each schedule as day}
			<section>
				<!-- Day Header -->
				<div class="mb-4 flex items-center gap-3">
					<div class="flex items-center gap-2">
						<h2 class="text-lg font-semibold {day.highlight ? 'text-zinc-100' : 'text-zinc-500'}">
							{day.title}
						</h2>
						{#if day.highlight}
							<div class="h-2 w-2 rounded-full bg-blue-400"></div>
						{/if}
					</div>
					<div class="h-px flex-1 bg-zinc-800"></div>
				</div>

				{#if day.isOffDay}
					<div class="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 text-center">
						<div
							class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800"
						>
							<span class="text-xl">🌙</span>
						</div>
						<p class="font-medium text-zinc-300">Rest Day</p>
						<p class="mt-1 text-sm text-zinc-500">No classes scheduled</p>
					</div>
				{:else if day.status?.status === 'break'}
					<div
						class="relative overflow-hidden rounded-2xl border border-amber-800/50 bg-amber-950/30 p-4"
						transition:slide
					>
						<div class="flex items-center gap-3">
							<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-900/50">
								<span class="text-lg">⏸️</span>
							</div>
							<div class="flex-1">
								<p class="font-medium text-amber-200">Break Time</p>
								<p class="text-sm text-amber-300">
									Next: {day.classes[day.status.nextIndex!]?.code || 'Unknown'}
								</p>
							</div>
						</div>
						{#if day.status.progress !== undefined}
							<div class="absolute bottom-0 left-0 h-1 w-full bg-amber-900/30">
								<div
									class="h-full bg-amber-400 transition-all duration-1000"
									style="width: {day.status.progress}%"
								></div>
							</div>
						{/if}
					</div>
				{/if}

				<!-- Class Cards -->
				<div
					class="scrollbar-hidden -mx-4 flex snap-x snap-mandatory scroll-pl-4 gap-3 overflow-x-auto px-4"
				>
					{#each day.classes as classItem, index}
						{@const isCurrentClass =
							day.status?.status === 'ongoing' && day.status?.index === index}
						<div class="{day.highlight ? 'w-72' : 'w-56'} flex-shrink-0 snap-start">
							<div
								class="relative rounded-2xl border bg-zinc-900/80 backdrop-blur-sm transition-all duration-200 {isCurrentClass
									? 'current-class border-emerald-600/50 shadow-lg ring-1 shadow-emerald-500/20 ring-emerald-500/20'
									: 'border-zinc-800 hover:border-zinc-700 hover:shadow-md hover:shadow-zinc-900/50'} overflow-hidden"
							>
								<!-- Time Badge -->
								<div
									class="absolute top-4 right-4 rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-1"
								>
									<span class="text-xs font-medium text-zinc-300">{classItem.time}</span>
								</div>

								<!-- Class Type Indicator -->
								<div class="absolute top-4 left-4">
									<div
										class="rounded-lg px-2 py-1 text-xs font-medium {classItem.sessional
											? 'border border-orange-800/50 bg-orange-900/50 text-orange-300'
											: 'border border-blue-800/50 bg-blue-900/50 text-blue-300'}"
									>
										{classItem.sessional ? 'Lab' : 'Theory'}
									</div>
								</div>

								<div class="p-4 pt-16">
									<!-- Course Code -->
									<div class="mb-2">
										<h3
											class="{day.highlight
												? 'text-lg'
												: 'text-base'} font-semibold tracking-tight {classItem.sessional
												? 'bg-gradient-to-br from-orange-200 via-orange-500 to-orange-700 bg-clip-text text-transparent'
												: 'bg-gradient-to-br from-blue-200 via-blue-500 to-blue-700 bg-clip-text text-transparent'}"
										>
											{classItem.code}
										</h3>
									</div>

									<!-- Course Name -->
									<h4 class="mb-2 line-clamp-2 h-9 text-sm leading-tight text-zinc-100">
										{classItem.name}
									</h4>

									<!-- Teachers -->
									{#if day.highlight && classItem.teachers.length > 0}
										<div class="flex h-15 flex-col justify-end gap-1">
											{#each classItem.teachers as teacher}
												<div class="flex items-center gap-2">
													<div class="h-1 w-1 rounded-full bg-zinc-600"></div>
													<span class="text-xs text-zinc-400">{teacher}</span>
												</div>
											{/each}
										</div>
									{/if}

									<!-- Progress Bar -->
									{#if isCurrentClass && day.status?.progress !== undefined}
										<div class="mt-4 border-t border-emerald-800/50 pt-4">
											<div class="mb-2 flex items-center justify-between">
												<span class="text-xs font-medium text-emerald-300">In Progress</span>
												<span class="text-xs text-emerald-400"
													>{Math.round(day.status.progress)}%</span
												>
											</div>
											<div class="h-1.5 overflow-hidden rounded-full bg-emerald-900/50">
												<div
													class="h-full bg-emerald-400 transition-all duration-1000"
													style="width: {day.status.progress}%"
												></div>
											</div>
										</div>
									{/if}
								</div>

								<!-- Current Class Glow -->
								{#if isCurrentClass}
									<div
										class="pointer-events-none absolute inset-0 rounded-2xl bg-emerald-500/5"
									></div>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</section>
		{/each}
	</div>

	<!-- Footer -->
	<footer class="border-t border-zinc-800 bg-zinc-900/50 px-4 py-8 text-center">
		<p class="text-sm text-zinc-500">
			Crafted by <a
				href="https://sh4jid.me"
				target="_blank"
				class="font-medium text-blue-400 hover:text-blue-300">@sh4jid</a
			>
		</p>
	</footer>

	<!-- Time Simulator FAB -->
	<div class="fixed right-4 bottom-4 z-50">
		<button
			onclick={() => (isSimulating = !isSimulating)}
			aria-label="{isSimulating ? 'Stop' : 'Start'} time simulation"
			class="flex h-14 w-14 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-white shadow-lg transition-all duration-200 hover:bg-zinc-700 hover:shadow-xl hover:shadow-zinc-900/50"
		>
			<div
				class="h-2 w-2 rounded-full {isSimulating ? 'animate-pulse bg-red-400' : 'bg-green-400'}"
			></div>
		</button>
	</div>

	<!-- Time Simulator Panel -->
	{#if isSimulating}
		<div
			class="fixed right-4 bottom-20 left-4 z-50 ml-auto max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900/95 p-4 shadow-2xl backdrop-blur-sm"
			transition:slide
		>
			<div class="mb-4 flex items-center gap-2 border-b border-zinc-800 pb-3">
				<div class="h-2 w-2 animate-pulse rounded-full bg-red-400"></div>
				<p class="font-semibold text-zinc-100">Time Simulator</p>
				<button
					onclick={() => (isSimulating = false)}
					aria-label="Close time simulator"
					class="ml-auto h-6 w-6 text-zinc-400 transition-colors hover:text-zinc-200"
				>
					✕
				</button>
			</div>

			<div class="space-y-4">
				<div>
					<label for="day-select" class="mb-2 block text-sm font-medium text-zinc-300">Day</label>
					<select
						id="day-select"
						bind:value={simulatedDay}
						class="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
					>
						{#each dayLabels as day, index}
							<option value={index}>{day}</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="time-slider" class="mb-2 block text-sm font-medium text-zinc-300">Time</label>
					<input
						id="time-slider"
						type="range"
						min="500"
						max="1200"
						step="1"
						bind:value={simulatedTimeMinutes}
						class="slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-700"
					/>
					<p class="mt-2 text-center text-sm font-medium text-zinc-100">
						{formatTimeFromMinutes(simulatedTimeMinutes)}
					</p>
				</div>
			</div>
		</div>
	{/if}
</main>

<style>
	.slider::-webkit-slider-thumb {
		appearance: none;
		height: 18px;
		width: 18px;
		border-radius: 50%;
		background: #e4e4e7;
		cursor: pointer;
		border: 2px solid #27272a;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	}

	.slider::-moz-range-thumb {
		height: 18px;
		width: 18px;
		border-radius: 50%;
		background: #e4e4e7;
		cursor: pointer;
		border: 2px solid #27272a;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	}

	.scrollbar-hidden {
		scrollbar-width: none;
		-ms-overflow-style: none;
	}

	.scrollbar-hidden::-webkit-scrollbar {
		display: none;
	}
</style>
