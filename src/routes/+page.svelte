<script lang="ts">
	import { onMount } from 'svelte';
	import type { Section } from '$lib/types';
	import { formatDate, formatTime, getScheduleData } from '$lib/utils';
	import DebugSimulator from '$lib/components/DebugSimulator.svelte';
	import SectionSelector from '$lib/components/SectionSelector.svelte';
	import ScheduleDay from '$lib/components/ScheduleDay.svelte';
	import InstallPwa from '$lib/components/InstallPWA.svelte';

	let isDebugModeEnabled = $state<boolean>(false);
	let currentSection = $state<Section>('A');
	let currentTime = $state<Date>(new Date());
	let isSimulating = $state<boolean>(false);
	let simulatedDay = $state<number>(new Date().getDay());
	let simulatedTimeMinutes = $state<number>(new Date().getHours() * 60 + new Date().getMinutes());

	onMount(() => {
		const savedSection = localStorage.getItem('currentSection') as Section | null;
		if (savedSection && ['A', 'B', 'C'].includes(savedSection)) {
			currentSection = savedSection;
		}

		const interval = setInterval(() => {
			if (!isSimulating) {
				currentTime = new Date();
				simulatedDay = currentTime.getDay();
				simulatedTimeMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
			}
		}, 10000);

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

	function handleToggleDebug(): void {
		isDebugModeEnabled = !isDebugModeEnabled;
		if (!isDebugModeEnabled) {
			isSimulating = false;
		}
	}

	function handleSectionChange(section: Section): void {
		currentSection = section;
		localStorage.setItem('currentSection', section);
	}

	function handleToggleSimulating(value: boolean): void {
		isSimulating = value;
	}

	function handleUpdateSimulatedDay(day: number): void {
		simulatedDay = day;
	}

	function handleUpdateSimulatedTime(minutes: number): void {
		simulatedTimeMinutes = minutes;
	}
</script>

<div>
	<InstallPwa />

	<DebugSimulator
		{isDebugModeEnabled}
		{isSimulating}
		{simulatedDay}
		{simulatedTimeMinutes}
		{currentTime}
		onToggleSimulating={handleToggleSimulating}
		onUpdateSimulatedDay={handleUpdateSimulatedDay}
		onUpdateSimulatedTime={handleUpdateSimulatedTime}
	/>

	<main class="container mx-auto {isDebugModeEnabled ? 'pt-40 pb-6' : 'py-6'}">
		<header class="mb-6 px-6">
			<div class="flex items-center gap-3">
				<h1 class="text-2xl font-bold tracking-tight text-white">Mechanical Engineering</h1>
				<span
					class="inline-block shrink-0 bg-blue-500/30 px-3 py-1 text-sm font-bold text-blue-200"
				>
					4-1
				</span>
			</div>
			<p class="mt-2 text-sm text-gray-400">
				<strong class="font-bold text-gray-200">{formatTime(currentTime)}</strong>
				<span class="ml-2">{formatDate(currentTime)}</span>
			</p>
		</header>

		<SectionSelector {currentSection} onSectionChange={handleSectionChange} />

		<div class="space-y-8 pb-24">
			{#each getScheduleData(currentTime, currentSection) as day}
				<ScheduleDay {day} />
			{/each}
		</div>

		<div class="flex items-center justify-between px-6">
			<a href="https://sh4jid.me">@sh4jid</a>
			<button
				onclick={handleToggleDebug}
				class="bg-gray-700/80 px-4 py-2 text-xs font-semibold text-gray-200 shadow-lg backdrop-blur-sm hover:bg-gray-600"
			>
				{isDebugModeEnabled ? 'Disable Debug Mode' : 'Enable Debug Mode'}
			</button>
		</div>
	</main>
</div>
