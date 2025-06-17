<script lang="ts">
	const handleClick = () => {
		const element = document.querySelector('.item-9');

		element?.scrollIntoView({
			behavior: 'smooth',
			inline: 'start'
		});
	};
</script>

<div class="hide-scrollbar overflow-x-auto">
	<div class="flex flex-nowrap px-6 py-4">
		<div class="bg-primary-200 m-2 h-20 w-48 flex-shrink-0">Item 1</div>
		<div class="m-2 h-20 w-48 flex-shrink-0 bg-green-200">Item 2</div>
		<div class="m-2 h-20 w-48 flex-shrink-0 bg-red-200">Item 3</div>
		<div class="m-2 h-20 w-48 flex-shrink-0 bg-yellow-200">Item 4</div>
		<div class="m-2 h-20 w-48 flex-shrink-0 bg-purple-200">Item 5</div>
		<div class="m-2 h-20 w-48 flex-shrink-0 bg-orange-200">Item 6</div>
	</div>
</div>

<button onclick={handleClick}>Click</button>
