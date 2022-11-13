import type { NextPage, GetStaticPaths, GetStaticProps } from 'next';
import type { Category, Recipe } from '@lib/sanity.schema';

import useSWR, { SWRConfig, unstable_serialize } from 'swr';
import { sanityClient } from '@lib/sanity';
import { useRouter } from 'next/router';
import { range } from 'lodash';
import usePagination from '@hooks/usePagination';
import {
  categorySlugQuery,
  categorySlugsQuery,
  categoriesRecipesExceptCategoryCountQuery,
  recipesPerCategoryQuery,
  recipesPerCategoryCountQuery,
} from '@lib/queries';
import {
  CATEGORIES_LIMIT,
  RECIPES_LIMIT,
  RECIPES_PAGES_LIMIT,
  RECIPES_SKELETON_CARDS,
  OrderKey,
  OrderDir,
} from '@lib/constants';

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
  slug: string;
  page: number;
  pages: number;
}

interface CategoryPageProps {
  category: Category;
  fallback: {
    [key: string]: any;
  };
}

const categoryFetcher = (slug: string) =>
  sanityClient.fetch(categorySlugQuery(), {
    slug,
  });

const categoriesFetcher = (slug: string) =>
  sanityClient.fetch(
    categoriesRecipesExceptCategoryCountQuery({
      orderPairs: [
        { orderKey: OrderKey.RECIPES_COUNT, orderDir: OrderDir.DESC },
      ],
    }),
    {
      slug,
      from: 0,
      to: CATEGORIES_LIMIT,
    }
  );

const recipesFetcher = (
  slug: string,
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
  return sanityClient.fetch(recipesPerCategoryQuery({ orderPairs }), {
    slug,
    from,
    to,
  });
};

const recipesCountFetcher = (slug: string) =>
  sanityClient.fetch(recipesPerCategoryCountQuery(), { slug });

const Page: NextPage<PageProps> = ({ slug, page, pages }) => {
  const { query }: { query: QueryParams } = useRouter();

  const { data: recipes } = useSWR<Recipe[]>(
    [
      slug,
      '/recipes',
      query.orderKey?.split(','),
      query.orderDir?.split(','),
      page,
    ],
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
        <Pagination page={page} pages={pages} maxPages={RECIPES_PAGES_LIMIT} />
      </div>
    </>
  );
};

const CategoryPage: NextPage<CategoryPageProps> = ({ category, fallback }) => {
  const slug = category.slug?.current as string;

  const { data: categories } = useSWR<Category[]>(
    [slug, '/categories'],
    categoriesFetcher,
    {
      onError: () =>
        toast({ type: 'error', message: 'Neboli nájdené žiadne kategórie' }),
    }
  );

  const { data: count } = useSWR(
    [slug, '/recipes/count'],
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
        <title>CookBook - {category.title}</title>
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
              Zobraziť všetky
            </span>
            <ArrowCircleRightIcon className='w-6 h-6 text-white group-hover:scale-105 transition-transform' />
          </div>
        </CardPlaceholder>
      </CategoriesLinear>
      <RecipesSortController />
      <SWRConfig value={{ fallback }}>
        <Page slug={slug} page={page} pages={pages} />
        <div className='hidden'>
          <Page slug={slug} page={page + 1} pages={pages} />
        </div>
      </SWRConfig>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.category as string;
  const category: Category = await categoryFetcher(slug);

  if (!category) return { notFound: true };

  const categories: Category[] = await categoriesFetcher(slug);
  const recipesCount: number = await recipesCountFetcher(slug);
  const recipes: Recipe[] = await recipesFetcher(slug, '/recipes', [], [], 0);

  return {
    props: {
      category,
      fallback: {
        [unstable_serialize([slug, '/categories'])]: categories,
        [unstable_serialize([slug, '/recipes/count'])]: recipesCount,
        [unstable_serialize([slug, '/recipes', [], [], 0])]: recipes,
      },
    },
    revalidate: 60,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: string[] = await sanityClient.fetch(categorySlugsQuery());
  return {
    paths: paths.map((category) => ({ params: { category } })),
    fallback: 'blocking',
  };
};

export default CategoryPage;
