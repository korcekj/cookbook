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
	completed: number;
}

export type RecipeFile = {
	metadata: Omit<Recipe, 'slug' | 'completed'>;
	default: ConstructorOfATypedSvelteComponent;
};

export type RecipeSort = 'date' | 'duration' | 'title' | 'servings' | 'completed';

export type CategorySort = 'title' | 'recipes';

export interface Sitemap {
	pages: string[];
	recipes: Recipe[];
	categories: Category[];
}
