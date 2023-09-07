import deburr from 'lodash/deburr';

export const url = (path: string) => {
	return path.replace(/([^:]\/)\/+/g, '$1');
};

export const slugify = (str: string) => {
	return deburr(str).toLowerCase().replace(/ +/g, '-');
};

export const viewTransition = (navigation: any): Promise<void> | void => {
	if (!document.startViewTransition) return;

	return new Promise((resolve) => {
		document.startViewTransition(async () => {
			resolve();
			await navigation.complete;
		});
	});
};
