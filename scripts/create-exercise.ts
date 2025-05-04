import * as p from '@clack/prompts';
import { shuffle } from 'es-toolkit';
import { padStart } from 'es-toolkit/compat';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import OpenAI from 'openai';
import { v7 as uuid } from 'uuid';
import { z } from 'zod';

let OPENAI_APIKEY = process.env.OPENAI_APIKEY;

p.intro('English Room Listening Exercise Generator');

let openai: OpenAI;
try {
	openai = new OpenAI({
		apiKey: OPENAI_APIKEY
	});
} catch (_) {
	p.cancel('Failed to connect to OpenAI.');
	process.exit(1);
}

const input = await p.group(
	{
		date: () =>
			p.text({
				message: 'Session date:',
				placeholder: 'YYYY-MM-DD',
				validate: (value) => {
					const { success } = z.safeParse(z.iso.date(), value);
					if (!success) return 'Please make sure that the format you use is YYYY-MM-DD.';
				}
			}),
		text: () =>
			p.text({
				message: 'Sentence:',
				validate: (value) => {
					if (value.trim().length === 0) return 'Please provide a complete sentence.';
				}
			}),
		voice: () =>
			p.select({
				message: 'Pick a voice:',
				options: [
					{ value: 'ballad', label: 'Ballad (Male)' },
					{ value: 'coral', label: 'Coral (Female)' },
					{ value: 'echo', label: 'Echo (Male)' },
					{ value: 'shimmer', label: 'Shimmer (Female)' }
				]
			})
	},
	{
		onCancel: () => {}
	}
);

let s = p.spinner();
s.start('Post-processing sentence and generating audio.');

let text = input.text.trim().replace(/\s+/, ' ');
if (!text.endsWith('.') && !text.endsWith('?') && !text.endsWith('!')) text += '.';

let words = shuffle(text.split(' '));

let audio = await openai.audio.speech.create({
	input: text,
	model: 'gpt-4o-mini-tts',
	voice: input.voice,
	instructions: `
Affect/personality: A cheerful teacher.

Tone: Friendly and clear, making the listener feels comfortable.

Pronunciation: Clear, articulate, and steady, ensuring each sentence is easily understood while maintaining a natural, conversational flow.
	`
});

let metaPath = path.resolve(process.cwd(), `./src/routes/exercises/${input.date}/exercise.json`);

try {
	await fs.access(metaPath, fs.constants.F_OK);
} catch {
	await fs.mkdir(path.dirname(metaPath), { recursive: true });
	await fs.writeFile(metaPath, '[]', 'utf8');
}

let exercise = JSON.parse(await fs.readFile(metaPath, 'utf8')) as Array<{
	id: string;
	type: 'a';
	text: string;
	words: string[];
	audioPath: string;
}>;

let order = padStart(String(exercise.length + 1), 2, '0');

let audioPath = path.resolve(process.cwd(), `./static/exercises/${input.date}/${order}.mp3`);

try {
	await fs.access(audioPath, fs.constants.F_OK);
} catch {
	await fs.mkdir(path.dirname(audioPath), { recursive: true });
}

await fs.writeFile(audioPath, new DataView(await audio.arrayBuffer()));

exercise.push({
	id: uuid(),
	type: 'a',
	text,
	words,
	audioPath: `/exercises/${input.date}/${order}.mp3`
});

await fs.writeFile(metaPath, JSON.stringify(exercise), 'utf8');

s.stop('Meta data and audio are successfully generated.');

p.outro('Listening exercise has been successfully generated.');
