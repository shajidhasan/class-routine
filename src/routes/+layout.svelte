<script lang="ts">
	import '@fontsource-variable/inter';
	import '../app.css';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.register('/sw.js');
		}
	});
</script>

{@render children()}
