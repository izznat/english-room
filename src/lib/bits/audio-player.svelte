<script lang="ts">
	const { src }: { src: string } = $props();

	let currentTime = $state(0);
	let duration = $state(0);
	let paused = $state(true);

	const formatTime = (time: number) => {
		if (isNaN(time)) return '...';

		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);

		return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
	};
</script>

<div class="flex items-center gap-2">
	<audio
		{src}
		bind:currentTime
		bind:duration
		bind:paused
		onended={() => {
			currentTime = 0;
		}}
	></audio>

	<button
		aria-label={paused ? 'Play' : 'Pause'}
		class="bg-blue-2 text-blue-9 hover:bg-blue-3 flex size-8 cursor-pointer items-center justify-center rounded-full transition-colors"
		onclick={() => {
			if (paused) {
				paused = false;
			} else {
				paused = true;
			}
		}}
	>
		{#if paused}
			<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"
				><path
					d="M3.24182 2.32181C3.3919 2.23132 3.5784 2.22601 3.73338 2.30781L12.7334 7.05781C12.8974 7.14436 13 7.31457 13 7.5C13 7.68543 12.8974 7.85564 12.7334 7.94219L3.73338 12.6922C3.5784 12.774 3.3919 12.7687 3.24182 12.6782C3.09175 12.5877 3 12.4252 3 12.25V2.75C3 2.57476 3.09175 2.4123 3.24182 2.32181ZM4 3.57925V11.4207L11.4288 7.5L4 3.57925Z"
					fill="currentColor"
					fill-rule="evenodd"
					clip-rule="evenodd"
				></path></svg
			>
		{:else}
			<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"
				><path
					d="M6.04995 2.74998C6.04995 2.44623 5.80371 2.19998 5.49995 2.19998C5.19619 2.19998 4.94995 2.44623 4.94995 2.74998V12.25C4.94995 12.5537 5.19619 12.8 5.49995 12.8C5.80371 12.8 6.04995 12.5537 6.04995 12.25V2.74998ZM10.05 2.74998C10.05 2.44623 9.80371 2.19998 9.49995 2.19998C9.19619 2.19998 8.94995 2.44623 8.94995 2.74998V12.25C8.94995 12.5537 9.19619 12.8 9.49995 12.8C9.80371 12.8 10.05 12.5537 10.05 12.25V2.74998Z"
					fill="currentColor"
					fill-rule="evenodd"
					clip-rule="evenodd"
				></path></svg
			>
		{/if}
	</button>

	<div class="flex grow gap-2">
		<span class="text-sand-11 font-mono text-xs tracking-widest uppercase select-none"
			>{formatTime(currentTime)}</span
		>
		<div
			class="bg-sand-4 h-4 grow rounded-full"
			onpointerdown={(e) => {
				const div = e.currentTarget;
				const isPlaying = !paused;

				function seek(e: PointerEvent) {
					if (isPlaying) {
						paused = true;
					}

					const { left, width } = div.getBoundingClientRect();

					let p = (e.clientX - left) / width;
					if (p < 0) p = 0;
					if (p > 1) p = 1;

					currentTime = p * duration;
				}

				seek(e);

				window.addEventListener('pointermove', seek);

				window.addEventListener(
					'pointerup',
					() => {
						window.removeEventListener('pointermove', seek);
						if (isPlaying) {
							paused = false;
						}
					},
					{
						once: true
					}
				);
			}}
		>
			<div
				class="bg-blue-3 h-full w-(--progress) rounded-full transition-transform"
				style="--progress: {(currentTime / duration) * 100}%"
			></div>
		</div>
		<span class="text-sand-11 font-mono text-xs tracking-widest uppercase select-none"
			>{formatTime(duration)}</span
		>
	</div>
</div>
