import { redirect, type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = () => {
	return redirect(307, '/exercises');
};
