<script lang="ts">
	import { onMount } from 'svelte';
	import type { Section } from '$lib/types';
	import { formatDate, formatTime, getScheduleData } from '$lib/utils';
	import DebugSimulator from '$lib/components/DebugSimulator.svelte';
	import SectionSelector from '$lib/components/SectionSelector.svelte';
	import ScheduleDay from '$lib/components/ScheduleDay.svelte';

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
			<h1 class="mb-2 text-2xl font-bold tracking-tight text-white">Class Routine</h1>
			<div class="text-lg font-medium text-gray-200">Mechanical Engineering • Level 4, Term 1</div>
			<div class="mt-2 text-sm">
				<span class="font-bold text-gray-200">{formatTime(currentTime)}</span>

				<span class="text-sm text-gray-400">
					{formatDate(currentTime)}
				</span>
			</div>
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
