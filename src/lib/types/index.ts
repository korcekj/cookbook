export interface Category {
	title: string;
	slug: string;
	recipes: number;
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

export type RecipeFile = {
	metadata: Omit<Recipe, 'slug'>;
	default: ConstructorOfATypedSvelteComponent;
};

export type RecipeSort = 'date' | 'duration' | 'title' | 'servings';

export type CategorySort = 'title' | 'recipes';

export interface Sitemap {
	pages: string[];
	recipes: Recipe[];
	categories: Category[];
}
