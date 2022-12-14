import type { NextPage, GetStaticProps } from 'next';
import type { Recipe, Category } from '@lib/sanity.schema';

import useSWR, { SWRConfig, unstable_serialize } from 'swr';
import { useRouter } from 'next/router';
import { range } from 'lodash';
import { sanityClient } from '@lib/sanity';
import {
  recipesQuery,
  recipesCountQuery,
  categoriesRecipesCountQuery,
} from '@lib/queries';
import {
  RECIPES_LIMIT,
  RECIPES_PAGES_LIMIT,
  RECIPES_SKELETON_CARDS,
  CATEGORIES_LIMIT,
  OrderKey,
  OrderDir,
} from '@lib/constants';
import usePagination from '@hooks/usePagination';
import useBasePath from '@hooks/useBasePath';

import Head from 'next/head';
import CardPlaceholder from '@components/card-placeholder';
import RecipesGrid from '@components/recipes-grid';
import RecipeCard from '@components/recipe-card';
import RecipeCardSkeleton from '@components/recipe-card-skeleton';
import CategoriesLinear from '@components/categories-linear';
import CategoryCard from '@components/category-card';
import ImageHint from '@components/image-hint';
import RecipesSortController from '@components/recipes-sort-controller';
import Pagination from '@components/pagination';
import toast from '@components/toast';

import { ArrowCircleRightIcon } from '@heroicons/react/outline';

interface QueryParams {
  orderKey?: OrderKey;
  orderDir?: OrderDir;
}

interface PageProps {
  page: number;
  pages: number;
}

interface RecipesPageProps {
  fallback: {
    [key: string]: any;
  };
}

const categoriesFetcher = () =>
  sanityClient.fetch(
    categoriesRecipesCountQuery({
      orderPairs: [
        { orderKey: OrderKey.RECIPES_COUNT, orderDir: OrderDir.DESC },
      ],
    }),
    {
      from: 0,
      to: CATEGORIES_LIMIT,
    }
  );

const recipesFetcher = (
  _: string,
  orderKeys: OrderKey[] = [],
  orderDirs: OrderDir[] = [],
  page: number
) => {
  const from = page * RECIPES_LIMIT || 0;
  const to = from + RECIPES_LIMIT;
  const orderPairs = orderKeys.map((orderKey, i) => ({
    orderKey,
    orderDir: orderDirs[i],
  }));
  return sanityClient.fetch(recipesQuery({ orderPairs }), {
    from,
    to,
  });
};

const recipesCountFetcher = () => sanityClient.fetch(recipesCountQuery());

const Page: NextPage<PageProps> = ({ page, pages }) => {
  const { query }: { query: QueryParams } = useRouter();

  const { data: recipes } = useSWR<Recipe[]>(
    ['/recipes', query.orderKey?.split(','), query.orderDir?.split(','), page],
    recipesFetcher,
    {
      onError: () =>
        toast({ type: 'error', message: 'Neboli n??jden?? ??iadne recepty' }),
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
          <span className='my-5 font-medium text-gray-700'>??iadne recepty</span>
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
        <Pagination page={page} pages={pages} maxPages={RECIPES_PAGES_LIMIT} />
      </div>
    </>
  );
};

const RecipesPage: NextPage<RecipesPageProps> = ({ fallback }) => {
  const basePath = useBasePath();

  const { data: categories } = useSWR<Category[]>(
    '/recipes/categories',
    categoriesFetcher,
    {
      onError: () =>
        toast({ type: 'error', message: 'Neboli n??jden?? ??iadne kateg??rie' }),
    }
  );

  const { data: count } = useSWR(['/recipes/count'], recipesCountFetcher, {
    fallbackData: 0,
    onError: () =>
      toast({ type: 'error', message: 'Neboli n??jden?? ??iadne recepty' }),
  });

  const { page, pages } = usePagination(count, RECIPES_LIMIT);

  return (
    <>
      <Head>
        <title>CookBook - Recepty</title>
        <meta
          name='description'
          content='Neviete sa rozhodn???? ??o dnes na obed alebo ve??eru? Potom je tu pre B??s zoznam na??ich ob????ben??ch a jednoduch??ch receptov'
        />
        <meta property='og:title' content='CookBook - Recepty' />
        <meta
          property='og:description'
          content='Neviete sa rozhodn???? ??o dnes na obed alebo ve??eru? Potom je tu pre B??s zoznam na??ich ob????ben??ch a jednoduch??ch receptov'
        />
        <meta property='og:image' content={`${basePath}/images/meals.svg`} />
      </Head>
      <CategoriesLinear>
        {categories?.map((category) => (
          <CategoryCard key={category._id} category={category} />
        ))}
        <CardPlaceholder
          to='/categories'
          imgSrc='/images/categories.svg'
          imgAlt='categories'
        >
          <div className='flex gap-x-2 items-center'>
            <span className='text-lg font-semibold text-white'>
              Zobrazi?? v??etky
            </span>
            <ArrowCircleRightIcon className='w-6 h-6 text-white group-hover:scale-105 transition-transform' />
          </div>
        </CardPlaceholder>
      </CategoriesLinear>
      <RecipesSortController />
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
  const recipes: Recipe[] = await recipesFetcher('/recipes', [], [], 0);

  return {
    props: {
      fallback: {
        '/recipes/count': recipesCount,
        '/recipes/categories': categories,
        [unstable_serialize(['/recipes', [], [], 0])]: recipes,
      },
    },
    revalidate: 3600,
  };
};

export default RecipesPage;
