<script lang="ts" module>
	import { z } from 'zod';
	import unsafe_exercise from './exercise.json';
	import { padStart } from 'es-toolkit/compat';

	const exerciseSchema = z.array(
		z.union([
			z.object({
				id: z.uuidv7(),
				type: z.literal('a'),
				text: z.string().min(1),
				words: z.array(z.string()),
				audioPath: z.string().startsWith('/')
			})
		])
	);

	const exercise = unsafe_exercise as unknown as z.Infer<typeof exerciseSchema>;
</script>

<script lang="ts">
	import AudioPlayer from '$lib/bits/audio-player.svelte';
	import { tick, untrack } from 'svelte';
	import { goto } from '$app/navigation';
	import { pushToast } from '$lib/bits/toaster.svelte';
	import { confetti } from '@neoconfetti/svelte';

	let number = $state(1);
	let question = $derived(exercise[number - 1]);
	let typeLabel = $derived(
		question.type === 'a' ? 'Listening' : question.type === 'b' ? 'Conversation' : 'Describing'
	);

	let isCorrect = $state(false);
	let showConfetti = $state(false);

	let arrangedWords = $state<string[]>([]);
	let shuffledWords = $state(untrack(() => question.words));
</script>

<div class="flex h-full flex-col">
	{#if showConfetti}
		<div use:confetti={{ stageHeight: 2400 }} class="absolute left-1/2"></div>
	{/if}
	<div class="border-sand-6 flex h-12 shrink-0 items-center border-x border-b border-dashed px-4">
		<span class="font-mono text-xs tracking-widest uppercase">English Room</span>
	</div>
	<a
		class="text-sand-11 hover:bg-sand-2 border-sand-6 flex shrink-0 gap-2 border-x border-b border-dashed p-4 font-mono text-xs tracking-widest uppercase transition-colors"
		href="/exercises"
		><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"
			><path
				d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L2.14645 7.85355C1.95118 7.65829 1.95118 7.34171 2.14645 7.14645L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645Z"
				fill="currentColor"
				fill-rule="evenodd"
				clip-rule="evenodd"
			></path></svg
		>Back to Exercises</a
	>
	<div class="border-sand-6 shrink-0 border-x border-b border-dashed p-4">
		<h1 class="text-xl">I'm Not Feeling Well</h1>
	</div>
	<div class="border-sand-6 flex grow flex-col border-x border-dashed">
		<div class="border-sand-6 border-b border-dashed p-4">
			<h2 class="text-sand-11 font-mono text-xs tracking-widest uppercase">
				{padStart(String(number), 2, '0')}/{padStart(String(exercise.length), 2, '0')}: {typeLabel}
			</h2>
		</div>
		<div class="flex grow flex-col">
			<div class="p-4">
				<AudioPlayer src={question.audioPath} />
			</div>
			<div class="grid grow grid-rows-2 gap-4 p-4 pt-0">
				<div class="border-sand-6 rounded-lg border border-dashed">
					<div class="border-sand-6 flex items-center border-b border-dashed p-4">
						<h3 class="text-sand-11 inline-block grow text-sm text-pretty">
							Select the word to return it back.
						</h3>
						<button
							aria-label="Reset"
							class="bg-blue-2 text-blue-9 hover:bg-blue-3 flex size-8 cursor-pointer items-center justify-center rounded-full transition-colors"
							onclick={() => {
								arrangedWords = [];
								shuffledWords = question.words;
							}}
						>
							<svg
								width="15"
								height="15"
								viewBox="0 0 15 15"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								><path
									d="M4.85355 2.14645C5.04882 2.34171 5.04882 2.65829 4.85355 2.85355L3.70711 4H9C11.4853 4 13.5 6.01472 13.5 8.5C13.5 10.9853 11.4853 13 9 13H5C4.72386 13 4.5 12.7761 4.5 12.5C4.5 12.2239 4.72386 12 5 12H9C10.933 12 12.5 10.433 12.5 8.5C12.5 6.567 10.933 5 9 5H3.70711L4.85355 6.14645C5.04882 6.34171 5.04882 6.65829 4.85355 6.85355C4.65829 7.04882 4.34171 7.04882 4.14645 6.85355L2.14645 4.85355C1.95118 4.65829 1.95118 4.34171 2.14645 4.14645L4.14645 2.14645C4.34171 1.95118 4.65829 1.95118 4.85355 2.14645Z"
									fill="currentColor"
									fill-rule="evenodd"
									clip-rule="evenodd"
								></path></svg
							>
						</button>
					</div>
					<div class="flex flex-wrap gap-4 p-4">
						{#each arrangedWords as word, index}
							<button
								class="bg-blue-2 hover:bg-blue-3 border-blue-6 flex h-10 cursor-pointer items-center rounded-full border px-4 transition-colors"
								onclick={() => {
									if (isCorrect) return;

									const [word] = arrangedWords.splice(index, 1);
									shuffledWords.push(word);
								}}
							>
								{word}
							</button>
						{/each}
					</div>
				</div>
				<div class="border-sand-6 bg-sand-2 flex flex-col rounded-lg border border-dashed">
					<div class="border-sand-6 flex items-center border-b border-dashed p-4">
						<h3 class="text-sand-11 text-sm text-pretty">
							Select the words in the correct order to form the sentence.
						</h3>
					</div>
					<div class="flex flex-wrap gap-4 p-4">
						{#each shuffledWords as word, index}
							<button
								class="bg-blue-2 hover:bg-blue-3 border-blue-6 flex h-10 cursor-pointer items-center rounded-full border px-4 transition-colors"
								onclick={() => {
									if (isCorrect) return;

									const [word] = shuffledWords.splice(index, 1);
									arrangedWords.push(word);
								}}
							>
								{word}
							</button>
						{/each}
					</div>
				</div>
			</div>
		</div>
		<div class="border-sand-6 border-t border-dashed p-2">
			<button
				class={[
					'flex h-12 w-full cursor-pointer items-center justify-center font-mono tracking-widest uppercase',
					isCorrect
						? 'bg-grass-2 text-grass-9 hover:bg-grass-3'
						: 'bg-blue-2 text-blue-9 hover:bg-blue-3'
				]}
				onclick={() => {
					if (!isCorrect) {
						if (arrangedWords.join(' ').toLowerCase() === question.text.toLowerCase()) {
							isCorrect = true;

							if (number < exercise.length) {
								pushToast({ data: { type: 'success', description: 'Awesome! Keep it up!' } });
							} else {
								showConfetti = true;
								pushToast({
									data: { type: 'success', description: `Awesome! Completed in a flash!` }
								});
							}
						} else {
							pushToast({ data: { type: 'error', description: 'Wrong answer. Try again!' } });
						}
					} else {
						if (number < exercise.length) {
							number += 1;
							arrangedWords = [];
							isCorrect = false;
							tick().then(() => {
								shuffledWords = question.words;
							});
						} else {
							goto('/exercises');
						}
					}
				}}
			>
				{#if isCorrect && number === exercise.length}
					Back to Exercises
				{:else if isCorrect}
					Continue
				{:else}
					Check
				{/if}
			</button>
		</div>
	</div>
</div>
