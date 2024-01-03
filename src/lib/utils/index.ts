import deburr from 'lodash/deburr';

export const url = (path: string) => {
	return path.replace(/([^:]\/)\/+/g, '$1');
};

export const slugify = (str: string) => {
	return deburr(str).toLowerCase().replace(/ +/g, '-');
};

export const toPairs = <T extends any[]>(arr: T): T[] => {
	if (arr.length % 2 !== 0) return [];
	return arr.reduce(
		(acc, current, i, all) => (i % 2 === 0 ? acc : [...acc, [all[i - 1], current]]),
		[]
	);
};
