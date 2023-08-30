export const scrollToHash = (_: HTMLElement) => {
	let timeout: number;

	const scroll = (hash?: string) => {
		timeout = setTimeout(() => {
			const el = hash ? document.querySelector(hash) : null;
			el?.scrollIntoView();
		}, 100);
	};

	scroll(location.hash);

	return {
		destroy() {
			clearTimeout(timeout);
		}
	};
};
