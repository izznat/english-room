<script lang="ts">
	import '../app.css';
	import themeScriptUrl from '../scripts/theme?url';
	import Toaster from '$lib/bits/toaster.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<script src={themeScriptUrl}></script>
</svelte:head>

<Toaster />

<div class="isolate flex h-full justify-center overflow-clip">
	<div class="max-w-xl grow">
		{@render children()}
	</div>
</div>
