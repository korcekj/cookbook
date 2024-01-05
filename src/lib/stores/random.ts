import { writable, get } from 'svelte/store';

export const createRandomStore = <T>(defaultItems: T[] = []) => {
	const item = writable<T | null>(null);
	const items = writable<T[]>(defaultItems);
	const selected = writable<Set<number>>(new Set());

	const set = (value: T[]) => {
		item.set(null);
		items.set(value);
		selected.set(new Set());
	};

	const random = (tries = get(items).length) => {
		let i = 0;
		let select = 0;
		while (i++ < tries) {
			select = Math.floor(Math.random() * get(items).length);
			if (!get(selected).has(select)) break;
		}

		if (get(items)[select] === get(item)) select = ++select % get(items).length;
		item.set(get(items)[select]);
		selected.update((v) => new Set([...v, select]));
	};

	return {
		set,
		random,
		subscribe: item.subscribe
	};
};
