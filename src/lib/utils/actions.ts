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

export const autofocus = (node: HTMLInputElement, value: boolean) => {
	let timeout: number;

	const focus = () => {
		setTimeout(() => {
			node.focus();
		}, 100);
	};

	if (value) focus();

	return {
		update(value: boolean) {
			if (value) focus();
		},
		destroy() {
			clearTimeout(timeout);
		}
	};
};
