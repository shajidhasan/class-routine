<script lang="ts">
	import '@fontsource/unifontex';
	import '../app.css';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker
				.register('/sw.js')
				.then(() => console.log('Service Worker registered'))
				.catch((err) => console.error('Service Worker registration failed:', err));
		}
	});
</script>

{@render children()}
