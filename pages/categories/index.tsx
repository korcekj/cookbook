import type { NextPage, GetStaticProps } from 'next';
import type { Recipe, Category } from '@lib/sanity.schema';

import useSWR, { SWRConfig, unstable_serialize } from 'swr';
import { sanityClient } from '@lib/sanity';
import { range } from 'lodash';
import usePagination from '@hooks/usePagination';
import {
  recipesPerCategoriesQuery,
  recipesPerCategoriesCountQuery,
  categoriesCountQuery,
  categoriesRecipesCountQuery,
} from '@lib/queries';
import {
  RECIPES_LIMIT,
  RECIPES_SKELETON_CARDS,
  CATEGORIES_PAGES_LIMIT,
  CATEGORIES_SKELETON_CARDS,
  OrderKey,
  OrderDir,
} from '@lib/constants';

import Head from 'next/head';
import RecipesGrid from '@components/recipes-grid';
import RecipeCard from '@components/recipe-card';
import RecipeCardSkeleton from '@components/recipe-card-skeleton';
import CategoriesGrid from '@components/categories-grid';
import CategoryCardSkeleton from '@components/category-card-skeleton';
import CategoryCard from '@components/category-card';
import ImageHint from '@components/image-hint';
import Pagination from '@components/pagination';
import toast from '@components/toast';

interface PageProps {
  page: number;
  pages: number;
}

interface CategoriesPageProps {
  fallback: {
    [key: string]: any;
  };
}

const categoriesFetcher = async () => {
  const categoriesCount = await sanityClient.fetch(categoriesCountQuery());
  return sanityClient.fetch(
    categoriesRecipesCountQuery({
      orderPairs: [{ orderKey: OrderKey.TITLE, orderDir: OrderDir.ASC }],
    }),
    {
      from: 0,
      to: categoriesCount,
    }
  );
};

const recipesCountFetcher = () =>
  sanityClient.fetch(recipesPerCategoriesCountQuery());

const recipesFetcher = (_: string, page: number) => {
  const from = page * RECIPES_LIMIT || 0;
  const to = from + RECIPES_LIMIT;
  return sanityClient.fetch(
    recipesPerCategoriesQuery({
      orderPairs: [{ orderKey: OrderKey.TITLE, orderDir: OrderDir.ASC }],
    }),
    {
      from,
      to,
    }
  );
};

const Page: NextPage<PageProps> = ({ page, pages }) => {
  const { data: recipes } = useSWR<Recipe[]>(
    ['/categories/recipes', page],
    recipesFetcher,
    {
      onError: () =>
        toast({ type: 'error', message: 'Neboli nájdené žiadne recepty' }),
    }
  );

  if (recipes?.length === 0)
    return (
      <div>
        <ImageHint
          imgSrc='/images/undraw-meal.svg'
          imgAlt='no data'
          className='py-2 my-4'
        >
          <span className='my-5 font-medium text-gray-700'>Žiadne recepty</span>
        </ImageHint>
      </div>
    );

  return (
    <>
      <div className='flex flex-col md:flex-row gap-x-4'>
        <div className='flex-1'>
          <RecipesGrid>
            {!recipes
              ? range(0, RECIPES_SKELETON_CARDS).map((v) => (
                  <RecipeCardSkeleton key={v} />
                ))
              : recipes.map((recipe) => (
                  <RecipeCard key={recipe._id} recipe={recipe} />
                ))}
          </RecipesGrid>
        </div>
      </div>
      <div className='my-2'>
        <Pagination
          page={page}
          pages={pages}
          maxPages={CATEGORIES_PAGES_LIMIT}
        />
      </div>
    </>
  );
};

const CategoriesPage: NextPage<CategoriesPageProps> = ({ fallback }) => {
  const { data: categories } = useSWR<Category[]>(
    '/categories/all',
    categoriesFetcher,
    {
      onError: () =>
        toast({ type: 'error', message: 'Neboli nájdené žiadne kategórie' }),
    }
  );

  const { data: count } = useSWR(
    '/categories/recipes/count',
    recipesCountFetcher,
    {
      fallbackData: 0,
      onError: () =>
        toast({ type: 'error', message: 'Neboli nájdené žiadne recepty' }),
    }
  );

  const { page, pages } = usePagination(count, RECIPES_LIMIT);

  return (
    <>
      <Head>
        <title>CookBook - Kategórie</title>
      </Head>
      <div className='bg-gray-50 px-4 mt-4 rounded border border-gray-100'>
        <CategoriesGrid>
          {!categories
            ? range(0, CATEGORIES_SKELETON_CARDS).map((v) => (
                <CategoryCardSkeleton key={v} />
              ))
            : categories.map((category) => (
                <CategoryCard key={category._id} category={category} />
              ))}
        </CategoriesGrid>
      </div>
      <SWRConfig value={{ fallback }}>
        <Page page={page} pages={pages} />
        <div className='hidden'>
          <Page page={page + 1} pages={pages} />
        </div>
      </SWRConfig>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const categories: Category[] = await categoriesFetcher();
  const recipesCount: number = await recipesCountFetcher();
  const recipes: Recipe[] = await recipesFetcher('/categories/recipes', 0);

  return {
    props: {
      fallback: {
        '/categories/all': categories,
        '/categories/recipes/count': recipesCount,
        [unstable_serialize(['/categories/recipes', 0])]: recipes,
      },
    },
    revalidate: 3600,
  };
};

export default CategoriesPage;
