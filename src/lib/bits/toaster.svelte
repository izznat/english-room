<script lang="ts" module>
	import { Toaster } from 'melt/builders';
	import { fly } from 'svelte/transition';

	type ToastData = { description: string; type: 'error' | 'success' };

	const toaster = new Toaster<ToastData>({
		closeDelay: 2000
	});

	export const pushToast = toaster.addToast;
</script>

<div
	{...toaster.root}
	class="fixed !right-0 !bottom-0 !left-0 flex w-full flex-col items-center bg-transparent p-4"
>
	{#each toaster.toasts as toast (toast.id)}
		<div
			{...toast.content}
			class={[
				'flex flex-col gap-4 rounded-lg border border-dashed p-4',
				toast.data.type === 'error' ? 'bg-tomato-2 border-tomato-6' : 'bg-grass-2 border-grass-6'
			]}
			in:fly={{ y: -200 }}
			out:fly={{ y: -100 }}
		>
			<div {...toast.description}>
				<p class={['text-pretty', toast.data.type === 'error' ? 'text-tomato-9' : 'text-grass-9']}>
					{toast.data.description}
				</p>
			</div>
		</div>
	{/each}
</div>
