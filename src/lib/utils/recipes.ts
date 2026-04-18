import type {
	RecipeFile,
	RecipeSort,
	Recipe,
	Category,
	CategorySort,
	Highlight,
	RecipeSearch,
	RecipeSearchKey
} from '$lib/types';
import type { FuseResultMatch, RangeTuple } from 'fuse.js';

import Fuse from 'fuse.js';
import dayjs from '$lib/utils/date';
import uniqueBy from 'lodash/uniqBy';
import { slugify, normalize } from '$lib/utils';

export const getRecipes = () => {
	const recipes = import.meta.glob<RecipeFile>('/src/recipes/*.md', { eager: true });

	return Object.entries(recipes).map(
		([path, file]) =>
			({
				slug: path.split('/').pop()?.split('.')[0] ?? '',
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
	const recipesIndex = new Fuse(recipes, {
		includeMatches: true,
		includeScore: true,
		ignoreDiacritics: true,
		ignoreLocation: true,
		threshold: 0.35,
		keys: [
			{ name: 'title', weight: 0.8 },
			{ name: 'description', weight: 0.2 }
		]
	});

	return (search: string) => {
		const term = normalize(search).trim();
		if (!term) return [];

		return recipesIndex.search(term).map(
			({ item, matches, score }): RecipeSearch => ({
				item,
				score: score ?? 0,
				highlight: {
					title: getHighlight('title', item.title, term, matches)
				}
			})
		);
	};
};

const getHighlight = (
	key: RecipeSearchKey,
	value: string,
	search: string,
	matches: ReadonlyArray<FuseResultMatch> = []
): Highlight[] => {
	const exactRanges = getExactRanges(value, search);
	const fuseRanges = matches.find((match) => match.key === key)?.indices;
	const ranges = mergeRanges(exactRanges.length ? exactRanges : fuseRanges);

	if (!ranges.length) return [{ text: value, match: false }];

	const segments: Highlight[] = [];
	let cursor = 0;

	for (const [start, end] of ranges) {
		if (cursor < start) {
			segments.push({
				text: value.slice(cursor, start),
				match: false
			});
		}

		segments.push({
			text: value.slice(start, end + 1),
			match: true
		});
		cursor = end + 1;
	}

	if (cursor < value.length) {
		segments.push({
			text: value.slice(cursor),
			match: false
		});
	}

	return segments.filter(({ text }) => text.length > 0);
};

const getExactRanges = (value: string, search: string): RangeTuple[] => {
	const normalizedValue = normalize(value);
	const normalizedSearch = normalize(search).trim();
	const ranges = findRanges(normalizedValue, normalizedSearch);

	if (ranges.length) return ranges;

	return normalizedSearch.split(/\s+/).flatMap((term) => findRanges(normalizedValue, term));
};

const findRanges = (value: string, search: string): RangeTuple[] => {
	if (!search) return [];

	const ranges: RangeTuple[] = [];
	let index = value.indexOf(search);

	while (index !== -1) {
		ranges.push([index, index + search.length - 1]);
		index = value.indexOf(search, index + search.length);
	}

	return ranges;
};

const mergeRanges = (ranges: ReadonlyArray<RangeTuple> = []) => {
	if (!ranges.length) return [];

	const sortedRanges = ranges
		.map(([start, end]) => [start, end] as [number, number])
		.sort(([startA], [startB]) => startA - startB);
	const merged = [sortedRanges[0]];

	for (const [start, end] of sortedRanges.slice(1)) {
		const previous = merged[merged.length - 1];

		if (start <= previous[1] + 1) {
			previous[1] = Math.max(previous[1], end);
			continue;
		}

		merged.push([start, end]);
	}

	return merged;
};

export const isRecipeSort = (sort: string): sort is RecipeSort =>
	Object.prototype.hasOwnProperty.call(recipeSort, sort);

export const isOccasion = (occasion: string): occasion is keyof typeof occasionCategory =>
	Object.prototype.hasOwnProperty.call(occasionCategory, occasion);

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
		'jedlá z bravčoviny',
		'omáčky'
	],
	večera: ['pomazánky', 'bezmäsité jedlá', 'cestoviny', 'šaláty', 'pizza', 'omáčky'],
	oslava: ['dezerty', 'šaláty']
};
