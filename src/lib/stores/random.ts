import { writable, get } from 'svelte/store';

export const createRandomStore = <T>(defaultItems: T[] = []) => {
	const item = writable<T | null>(null);
	let items = defaultItems;
	let selected = new Set<number>();

	const set = (value: T[]) => {
		item.set(null);
		items = value;
		selected = new Set();
	};

	const random = () => {
		if (!items.length) return null;

		const current = get(item);
		let available = items.map((_, index) => index).filter((index) => !selected.has(index));

		if (!available.length) {
			selected.clear();
			available = items.map((_, index) => index).filter((index) => items[index] !== current);
		}

		const select = available[Math.floor(Math.random() * available.length)] ?? 0;
		item.set(items[select]);
		selected.add(select);

		return items[select];
	};

	return {
		set,
		random,
		subscribe: item.subscribe
	};
};
