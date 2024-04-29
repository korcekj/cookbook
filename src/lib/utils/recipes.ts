import type { RecipeFile, RecipeSort, Recipe, Category, CategorySort } from '$lib/types';

import deburr from 'lodash/deburr';
import dayjs from '$lib/utils/date';
import FlexSearch from 'flexsearch';
import { slugify } from '$lib/utils';
import uniqueBy from 'lodash/uniqBy';

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

export const getCategories = () => {
	const recipes = getRecipes();

	return recipes.reduce((acc, recipe) => {
		recipe.categories.forEach((category) => {
			const index = acc.findIndex(({ title }) => title === category);
			if (index === -1) acc.push({ title: category, slug: slugify(category), recipes: [recipe] });
			else acc[index].recipes.push(recipe);
		});
		return acc;
	}, [] as Category[]);
};

export const getCategoryRecipes = (category: string) => {
	const categories = getCategories();
	const recipes = slugify(category)
		.split(',')
		.reduce((acc, name) => {
			const found = categories.find(({ slug }) => slug === name);
			if (found) return acc.concat(found.recipes);
			return acc;
		}, [] as Recipe[]);

	return uniqueBy(recipes, 'slug');
};

export const getOccasionRecipes = (occasion: string) => {
	let recipes: Recipe[] = [];

	if (isOccasion(occasion)) {
		const categories = occasionCategory[occasion];
		recipes = getCategoryRecipes(categories.join(','));
	}

	return recipes;
};

export const getOccasionCategories = (occasion: string) => {
	let categories: Category[] = [];

	if (isOccasion(occasion)) {
		const occasionCategories = occasionCategory[occasion];
		const recipeCategories = getCategories();
		categories = recipeCategories.filter((c) => occasionCategories.includes(c.title));
	}

	return categories;
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
				return (desc ? -1 : 1) * (a.recipes.length - b.recipes.length);
			default:
				return 0;
		}
	};
};

export const searchRecipes = (recipes: Recipe[]) => {
	const recipesIndex = new FlexSearch.Index({
		tokenize: 'forward',
		encode: (str) => deburr(str).toLowerCase().split(/\W+/)
	});

	recipes.forEach(({ title, description }, i) => {
		const item = `${title} ${description}`;
		recipesIndex.add(i, item);
	});

	return (search: string) => {
		const term = deburr(search);
		return recipesIndex.search(term).map((index) => recipes[index as number]);
	};
};

export const isRecipeSort = (sort: string): sort is RecipeSort => recipeSort.hasOwnProperty(sort);

export const isOccasion = (occasion: string): occasion is keyof typeof occasionCategory =>
	occasionCategory.hasOwnProperty(occasion);

export const recipeSort = {
	'-date': 'Najnovšie',
	duration: 'Najrýchlejšie',
	'-servings': 'Najviac porcií'
} as Record<string, string>;

export const occasionCategory = {
	raňajky: ['pomazánky'],
	obed: [
		'bezmäsité jedlá',
		'šaláty',
		'cestoviny',
		'polievky',
		'mäsité jedlá',
		'jedlá z hydiny',
		'pizza',
		'jedlá z bravčoviny'
	],
	večera: ['pomazánky', 'bezmäsité jedlá', 'cestoviny', 'šaláty', 'pizza'],
	oslava: ['dezerty', 'šaláty']
};
