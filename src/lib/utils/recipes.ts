import type { RecipeFile, RecipeSort, Recipe, Category, CategorySort } from '$lib/types';

import dayjs from '$lib/utils/date';
import { slugify } from '$lib/utils';

export const getRecipes = () => {
	const recipes = import.meta.glob<RecipeFile>('/src/recipes/*.md', { eager: true });

	return Object.entries(recipes).map(
		([path, file]) =>
			({
				slug: path.split('/').pop()?.split('.')[0]!,
				completed: 0,
				...file.metadata
			} satisfies Recipe)
	);
};

export const getCategories = () => {
	const recipes = getRecipes();

	return recipes.reduce((acc, { categories }) => {
		categories.forEach((category) => {
			const index = acc.findIndex(({ title }) => title === category);
			if (index === -1) acc.push({ title: category, slug: slugify(category), recipes: 1 });
			else acc[index].recipes++;
		});
		return acc;
	}, [] as Category[]);
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
			case 'completed':
				return (desc ? -1 : 1) * (a.completed - b.completed);
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
	'-servings': 'Najviac porcií',
	'-completed': 'Najobľúbenejšie'
} as Record<string, string>;

export const isRecipeSort = (sort: string): sort is RecipeSort => sort in recipeSorts;
