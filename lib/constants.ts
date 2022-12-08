export enum OrderKey {
  TITLE = 'title',
  UPDATED_AT = '_updatedAt',
  CREATED_AT = '_createdAt',
  SCORE = '_score',
  COOK_TIME = '(cook + preparation)',
  RECIPES_COUNT = 'recipesCount',
  SERVINGS = 'servings.size',
}

export enum OrderDir {
  DESC = 'desc',
  ASC = 'asc',
}

export const RECIPES_LIMIT = 12;
export const RECIPES_PAGES_LIMIT = 5;
export const RECIPES_SKELETON_CARDS = 8;
export const RECIPES_QUERY_KEYS = ['q'];
export const RECIPES_CONTROLLERS = [
  {
    key: OrderKey.TITLE,
    title: 'Názov',
  },
  {
    key: OrderKey.COOK_TIME,
    title: 'Čas prípravy',
  },
  {
    key: OrderKey.SERVINGS,
    title: 'Počet porcií',
  },
  {
    key: OrderKey.CREATED_AT,
    title: 'Pridané',
  },
];

export const CATEGORIES_LIMIT = 12;
export const CATEGORIES_PAGES_LIMIT = 5;
export const CATEGORIES_SKELETON_CARDS = 6;
