import type { RecipeFile, RecipeSort, Recipe, Category, CategorySort } from '$lib/types';

import dayjs from '$lib/utils/date';

export const getRecipes = () => {
	const recipes = import.meta.glob<RecipeFile>('/src/recipes/*.md', { eager: true });

	return Object.entries(recipes).map(
		([path, file]) =>
			({
				slug: path.split('/').pop()?.split('.')[0]!,
				...file.metadata
			} satisfies Recipe)
	);
};

export const sortRecipes = (sort: string) => {
	const desc = sort[0] === '-';
	if (desc) sort = sort.slice(1);

	return (a: Recipe, b: Recipe) => {
		switch (sort as RecipeSort) {
			case 'date':
				return (desc ? -1 : 1) * dayjs(a.date).diff(dayjs(b.date));
			case 'duration':
				return (desc ? -1 : 1) * (a.preparation + a.cooking - (b.preparation + b.cooking));
			case 'title':
				return (desc ? -1 : 1) * a.title.localeCompare(b.title);
			case 'servings':
				return (desc ? -1 : 1) * (a.servings.count - b.servings.count);
			default:
				return 0;
		}
	};
};

export const sortCategories = (sort: string) => {
	const desc = sort[0] === '-';
	if (desc) sort = sort.slice(1);

	return (a: Category, b: Category) => {
		switch (sort as CategorySort) {
			case 'title':
				return (desc ? -1 : 1) * a.title.localeCompare(b.title);
			case 'recipes':
				return (desc ? -1 : 1) * (a.recipes - b.recipes);
			default:
				return 0;
		}
	};
};

export const recipeSorts = {
	'-date': 'Najnovšie',
	duration: 'Najrýchlejšie',
	'-servings': 'Najviac porcií'
} as Record<string, string>;

export const isRecipeSort = (sort: string): sort is RecipeSort => sort in recipeSorts;
