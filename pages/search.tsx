import type { NextPage } from 'next';
import type { Recipe } from '@lib/sanity.schema';

import useSWR from 'swr';
import { useRouter } from 'next/router';
import { range } from 'lodash';
import { sanityClient } from '@lib/sanity';
import { recipesSearchQuery, recipesSearchCountQuery } from '@lib/queries';
import {
  RECIPES_LIMIT,
  RECIPES_PAGES_LIMIT,
  RECIPES_SKELETON_CARDS,
  OrderKey,
  OrderDir,
} from '@lib/constants';
import usePagination from '@hooks/usePagination';
import useBasePath from '@hooks/useBasePath';

import Head from 'next/head';
import RecipesGrid from '@components/recipes-grid';
import RecipeCard from '@components/recipe-card';
import RecipeCardSkeleton from '@components/recipe-card-skeleton';
import RecipesSortController from '@components/recipes-sort-controller';
import Pagination from '@components/pagination';
import Search from '@components/search';
import ImageHint from '@components/image-hint';
import toast from '@components/toast';

interface PageProps {
  page: number;
  pages: number;
}

interface QueryParams {
  q?: string;
  orderKey?: OrderKey;
  orderDir?: OrderDir;
}

const recipesPaginationFetcher = (
  _: string,
  search: string,
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
  return sanityClient.fetch(
    recipesSearchQuery({
      orderPairs: [
        { orderKey: OrderKey.SCORE, orderDir: OrderDir.DESC },
        ...orderPairs,
      ],
    }),
    {
      search: search ? `*${search}*` : '',
      from,
      to,
    }
  );
};

const recipesCountFetcher = (_: string, search: string) =>
  sanityClient.fetch(recipesSearchCountQuery(), {
    search: search ? `*${search}*` : '',
  });

const Page: NextPage<PageProps> = ({ page, pages }) => {
  const { query }: { query: QueryParams } = useRouter();

  const { data: recipes } = useSWR<Recipe[]>(
    query.q
      ? [
          '/search/recipes',
          query.q,
          query.orderKey?.split(','),
          query.orderDir?.split(','),
          page,
        ]
      : null,
    recipesPaginationFetcher,
    {
      onError: () =>
        toast({ type: 'error', message: 'H??adanie receptov zlyhalo' }),
    }
  );

  if (recipes?.length === 0)
    return (
      <div>
        <Search
          searchId='page-search'
          placeholder='H??adaj recept..'
          inputClassName='
                p-4
                text-gray-900 
                bg-gray-100
                placeholder-gray-700 
                border-transparent 
                focus:ring-0 
                focus:border-gray-700
              '
          iconClassName='w-6 h-6 text-gray-500'
        />
        <ImageHint
          imgSrc='/images/undraw-no-data.svg'
          imgAlt='no data'
          className='mt-4 py-2'
        >
          <span className='my-5 font-medium text-gray-700'>
            ??iadne v??sledky
          </span>
        </ImageHint>
      </div>
    );

  return (
    <>
      <RecipesSortController />
      <RecipesGrid>
        {!recipes
          ? range(0, RECIPES_SKELETON_CARDS).map((v) => (
              <RecipeCardSkeleton key={v} />
            ))
          : recipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
      </RecipesGrid>
      <div className='my-2'>
        <Pagination page={page} pages={pages} maxPages={RECIPES_PAGES_LIMIT} />
      </div>
    </>
  );
};

const SearchPage: NextPage = () => {
  const basePath = useBasePath();
  const { query }: { query: QueryParams } = useRouter();

  const { data: count } = useSWR(
    query.q ? ['/search/count', query.q] : null,
    recipesCountFetcher,
    {
      fallbackData: 0,
      onError: () =>
        toast({ type: 'error', message: 'Neboli n??jden?? ??iadne recepty' }),
    }
  );

  const { page, pages } = usePagination(count, RECIPES_LIMIT);

  if (!query.q)
    return (
      <div>
        <div className='my-4'>
          <Search
            searchId='page-search'
            placeholder='H??adaj recept..'
            inputClassName='
              p-4
              text-gray-900
              bg-gray-100
              placeholder-gray-700
              border-transparent
              focus:ring-0
              focus:border-gray-700
            '
            iconClassName='w-6 h-6 text-gray-500'
          />
        </div>
        <ImageHint
          imgSrc='/images/undraw-search.svg'
          imgAlt='search'
          className='py-2'
        >
          <span className='my-5 font-medium text-gray-700'>H??adaj recepty</span>
        </ImageHint>
      </div>
    );

  return (
    <>
      <Head>
        <title>CookBook - H??adaj</title>
        <meta
          name='description'
          content='Pozn??te n??zov receptu, ale nem??te ??as si vychutna?? v??etky recepty tak nev??hajte si recept vyh??ada??'
        />
        <meta property='og:title' content='CookBook - H??adaj' />
        <meta
          property='og:description'
          content='Pozn??te n??zov receptu, ale nem??te ??as si vychutna?? v??etky recepty tak nev??hajte si recept vyh??ada??eviete sa rozhodn???? ??o dnes na obed alebo ve??eru? Potom je tu pre B??s zoznam na??ich ob????ben??ch a jednoduch??ch receptov'
        />
        <meta property='og:image' content={`${basePath}/images/meals.svg`} />
      </Head>
      <div className='py-4 inline-block'>
        <div className='font-medium px-4 py-2 text-gray-700 bg-gray-200 rounded'>
          <span>Po??et n??jden??ch v??sledkov: {count}</span>
        </div>
      </div>
      <Page page={page} pages={pages} />
      <div className='hidden'>
        <Page page={page + 1} pages={pages} />
      </div>
    </>
  );
};

export default SearchPage;
