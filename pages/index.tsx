import type { FC } from 'react';
import type { NextPage, GetStaticProps } from 'next';
import type { Recipe, Category } from '@lib/sanity.schema';

import useSWR, { SWRConfig } from 'swr';
import { sanityClient } from '@lib/sanity';
import { recipesQuery, categoriesQuery } from '@lib/queries';
import {
  RECIPES_LIMIT,
  CATEGORIES_LIMIT,
  OrderKey,
  OrderDir,
} from '@lib/constants';
import useBasePath from '@hooks/useBasePath';

import Head from 'next/head';
import Link from 'next/link';
import RecipesLinear from '@components/recipes-linear';
import RecipesGrid from '@components/recipes-grid';
import RecipeCard from '@components/recipe-card';
import RecipeSocials from '@components/recipe-socials';
import CategoriesLinear from '@components/categories-linear';
import CategoryCard from '@components/category-card';
import CardPlaceholder from '@components/card-placeholder';
import Search from '@components/search';
import Teaser from '@components/teaser';
import toast from '@components/toast';

import { ArrowCircleRightIcon } from '@heroicons/react/outline';
import { HashtagIcon } from '@heroicons/react/solid';

interface HomePageProps {
  fallback: {
    [key: string]: any;
  };
}

const recipesLatestFetcher = () =>
  sanityClient.fetch(
    recipesQuery({
      orderPairs: [{ orderKey: OrderKey.CREATED_AT, orderDir: OrderDir.DESC }],
    }),
    {
      from: 0,
      to: RECIPES_LIMIT,
    }
  );

const recipesFastestFetcher = () =>
  sanityClient.fetch(
    recipesQuery({
      orderPairs: [{ orderKey: OrderKey.COOK_TIME, orderDir: OrderDir.ASC }],
    }),
    {
      from: 0,
      to: RECIPES_LIMIT - 1,
    }
  );

const categoriesFetcher = () =>
  sanityClient.fetch(
    categoriesQuery({
      orderPairs: [{ orderKey: OrderKey.TITLE, orderDir: OrderDir.ASC }],
    }),
    {
      from: 0,
      to: CATEGORIES_LIMIT,
    }
  );

const HomePage: NextPage<HomePageProps> = ({ fallback }) => {
  const basePath = useBasePath();

  return (
    <>
      <Head>
        <title>CookBook</title>
        <meta
          name='description'
          content='Neviete sa rozhodn???? ??o dnes na obed alebo ve??eru? Potom je tu pre V??s zoznam na??ich ob????ben??ch a jednoduch??ch receptov'
        />
        <meta property='og:title' content='CookBook' />
        <meta
          property='og:description'
          content='Neviete sa rozhodn???? ??o dnes na obed alebo ve??eru? Potom je tu pre V??s zoznam na??ich ob????ben??ch a jednoduch??ch receptov'
        />
        <meta property='og:image' content={`${basePath}/images/meals.svg`} />
      </Head>
      <div>
        <div className='grid grid-cols-2 gap-4'>
          <Link href='/recipes'>
            <a className='bg-emerald-400/10 text-emerald-900 rounded text-center font-medium p-3 hover:bg-emerald-400/20 duration-150'>
              Recepty
            </a>
          </Link>
          <Link href='/categories'>
            <a className='bg-emerald-400/10 text-emerald-900 rounded text-center font-medium p-3 hover:bg-emerald-400/20 duration-150'>
              Kateg??rie
            </a>
          </Link>
        </div>
      </div>
      <div className='mt-4'>
        <div>
          <Link href='#new-recipes'>
            <a
              id='new-recipes'
              className='inline-block text-2xl font-semibold text-gray-900'
            >
              <div className='flex items-center space-x-1'>
                <HashtagIcon className='flex-none w-5 h-5 text-gray-500' />
                <span>Najnov??ie recepty</span>
              </div>
            </a>
          </Link>
          <SWRConfig
            value={{
              fallback,
              fetcher: recipesLatestFetcher,
              onError: () =>
                toast({
                  type: 'error',
                  message: 'Na????tanie receptov zlyhalo',
                }),
            }}
          >
            <RecipesHorizontal />
          </SWRConfig>
        </div>
        <div>
          <Link href='#recipe-categories'>
            <a
              id='recipe-categories'
              className='inline-block text-2xl font-semibold text-gray-900'
            >
              <div className='flex items-center space-x-1'>
                <HashtagIcon className='flex-none w-5 h-5 text-gray-500' />
                <span>Kateg??rie receptov</span>
              </div>
            </a>
          </Link>
          <SWRConfig
            value={{
              fallback,
              fetcher: categoriesFetcher,
              onError: () =>
                toast({
                  type: 'error',
                  message: 'Na????tanie kateg??ri?? zlyhalo',
                }),
            }}
          >
            <CategoriesHorizontal />
          </SWRConfig>
        </div>
        <div className='my-4'>
          <Teaser
            title='H??ad??te recept ?'
            description={
              <>
                V pr??pade, ??e chcete n??js?? recept, ktor??ho n??zov, popr??pade jeho
                ??as?? pozn??te, ale nem??te ??as si vychutna?? v??etky recepty tak
                nev??hajte si recept vyh??ada??. Sta???? zada?? k??????ov?? znaky alebo
                slov?? do po??a &quot;H??adaj&quot; v hlavi??ke{' '}
                <Link href='/search'>
                  <a className='underline text-gray-900'>str??nky</a>
                </Link>
                , alebo priamo v tomto popise. Chutn?? h??adanie ????
              </>
            }
          >
            <Search
              searchId='teaser-search'
              placeholder='H??adaj recept..'
              inputClassName='
                placeholder-gray-700 
                text-gray-700 
                bg-gray-100 
                border-gray-500/50 
                focus:bg-gray-50 
                focus:ring-0 
                focus:border-gray-500
              '
              iconClassName='w-6 h-6 text-gray-600'
            />
          </Teaser>
        </div>
        <div>
          <Link href='#fast-recipes'>
            <a
              id='fast-recipes'
              className='inline-block text-2xl font-semibold text-gray-900'
            >
              <div className='flex items-center space-x-1'>
                <HashtagIcon className='flex-none w-5 h-5 text-gray-500' />
                <span>Najr??chlej??ie recepty</span>
              </div>
            </a>
          </Link>
          <SWRConfig
            value={{
              fallback,
              fetcher: recipesFastestFetcher,
              onError: () =>
                toast({ type: 'error', message: 'Na????tanie receptov zlyhalo' }),
            }}
          >
            <RecipesVertical />
          </SWRConfig>
        </div>
        <div className='my-4'>
          <Teaser
            reversed={true}
            title='M??te chu?? recept zdie??a?? ?'
            description={
              <>
                Pre zdie??anie receptu pou??ite tla??idl?? pri detaile receptu v
                hornej ??asti obrazovky. Recept je mo??n?? zdie??a?? aj
                prostredn??ctvom soci??lnych siet??, popr??pade si ho necha??
                vytla??i??. Chutn?? zdie??anie ????
              </>
            }
          >
            <RecipeSocials
              parentClassName='justify-center'
              url={basePath}
              image={`${basePath}/images/meals.svg`}
              quote='Neviete sa rozhodn???? ??o dnes na obed alebo ve??eru? Potom je tu pre V??s zoznam na??ich ob????ben??ch a jednoduch??ch receptov'
            />
          </Teaser>
        </div>
      </div>
    </>
  );
};

const RecipesHorizontal: FC = () => {
  const { data: recipes } = useSWR<Recipe[]>('/recipes/latest');

  return (
    <RecipesLinear>
      {recipes?.map((recipe) => (
        <RecipeCard key={recipe._id} recipe={recipe} />
      ))}
      <CardPlaceholder
        to={{
          pathname: '/recipes',
          query: {
            orderKey: OrderKey.CREATED_AT,
            orderDir: OrderDir.DESC,
          },
        }}
        imgSrc='/images/meals.svg'
        imgAlt='recipes'
      >
        <div className='flex flex-col gap-y-1 items-center'>
          <span className='text-2xl font-semibold text-white'>
            Zobrazi?? v??etky
          </span>
          <span className='text-base underline font-light text-white'>
            Najnov??ie recepty
          </span>
          <ArrowCircleRightIcon className='mt-4 w-10 h-10 text-white group-hover:scale-105 transition-transform' />
        </div>
      </CardPlaceholder>
    </RecipesLinear>
  );
};

const RecipesVertical: FC = () => {
  const { data: recipes } = useSWR<Recipe[]>('/recipes/fastest');

  return (
    <RecipesGrid>
      {recipes?.map((recipe) => (
        <RecipeCard key={recipe._id} recipe={recipe} />
      ))}
      <CardPlaceholder
        to={{
          pathname: '/recipes',
          query: {
            orderKey: OrderKey.COOK_TIME,
            orderDir: OrderDir.ASC,
          },
        }}
        parentClassName='min-h-[24rem]'
        imgSrc='/images/buffets.svg'
        imgAlt='recipes'
      >
        <div className='flex flex-col gap-y-1 items-center'>
          <span className='text-2xl font-semibold text-white'>
            Zobrazi?? v??etky
          </span>
          <span className='text-base underline font-light text-white'>
            Najr??chlej??ie recepty
          </span>
          <ArrowCircleRightIcon className='mt-4 w-10 h-10 text-white group-hover:scale-105 transition-transform' />
        </div>
      </CardPlaceholder>
    </RecipesGrid>
  );
};

const CategoriesHorizontal: FC = () => {
  const { data: categories } = useSWR<Category[]>('/categories');

  return (
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
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const recipesLatest: Recipe[] = await recipesLatestFetcher();
  const recipesFastest: Recipe[] = await recipesFastestFetcher();
  const categories: Category[] = await categoriesFetcher();

  return {
    props: {
      fallback: {
        '/recipes/latest': recipesLatest,
        '/recipes/fastest': recipesFastest,
        '/categories': categories,
      },
    },
    revalidate: 3600,
  };
};

export default HomePage;
