import deburr from 'lodash/deburr';

export const url = (path: string) => {
	return path.replace(/([^:]\/)\/+/g, '$1');
};

export const slugify = (str: string) => {
	return deburr(str).toLowerCase().replace(/ +/g, '-');
};
