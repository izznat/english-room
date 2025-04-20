(function theme() {
	let matchDark = window.matchMedia('(prefers-color-scheme: dark)');
	let html = document.documentElement;

	/** @param {boolean} dark  */
	function apply(dark) {
		if (dark) {
			html.style.colorScheme = 'dark';
			html.classList.remove('light');
			html.classList.add('dark');
		} else {
			html.style.colorScheme = 'light';
			html.classList.remove('dark');
			html.classList.add('light');
		}
	}

	apply(matchDark.matches);

	matchDark.addEventListener('change', (e) => {
		apply(e.matches);
	});
})();
