export interface Category {
	title: string;
	slug: string;
	recipes: Recipe[];
}

export interface Servings {
	unit: string;
	count: number;
}

export interface Recipe {
	slug: string;
	title: string;
	description: string;
	poster: string;
	categories: string[];
	servings: Servings;
	preparation: number;
	cooking: number;
	date: string;
}

export interface Highlight {
	text: string;
	match: boolean;
}

export interface RecipeSearch {
	item: Recipe;
	score: number;
	highlight: {
		title: Highlight[];
	};
}

export type RecipeFile = {
	metadata: Omit<Recipe, 'slug'>;
	default: ConstructorOfATypedSvelteComponent;
};

export type RecipeSearchKey = 'title' | 'description';

export type RecipeSort = 'date' | 'duration' | 'title' | 'servings';

export type CategorySort = 'title' | 'recipes';

export interface Sitemap {
	pages: string[];
	recipes: Recipe[];
	categories: Category[];
}
