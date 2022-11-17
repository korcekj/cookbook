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
          content='Neviete sa rozhodnúť čo dnes na obed alebo večeru? Potom je tu pre Vás zoznam našich obľúbených a jednoduchých receptov'
        />
        <meta property='og:title' content='CookBook' />
        <meta
          property='og:description'
          content='Neviete sa rozhodnúť čo dnes na obed alebo večeru? Potom je tu pre Vás zoznam našich obľúbených a jednoduchých receptov'
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
              Kategórie
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
                <span>Najnovšie recepty</span>
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
                  message: 'Načítanie receptov zlyhalo',
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
                <span>Kategórie receptov</span>
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
                  message: 'Načítanie kategórií zlyhalo',
                }),
            }}
          >
            <CategoriesHorizontal />
          </SWRConfig>
        </div>
        <div className='my-4'>
          <Teaser
            title='Hľadáte recept ?'
            description={
              <>
                V prípade, že chcete nájsť recept, ktorého názov, poprípade jeho
                časť poznáte, ale nemáte čas si vychutnať všetky recepty tak
                neváhajte si recept vyhľadať. Stačí zadať kľúčové znaky alebo
                slová do poľa &quot;Hľadaj&quot; v hlavičke{' '}
                <Link href='/search'>
                  <a className='underline text-gray-900'>stránky</a>
                </Link>
                , alebo priamo v tomto popise. Chutné hľadanie 🔎
              </>
            }
          >
            <Search
              searchId='teaser-search'
              placeholder='Hľadaj recept..'
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
                <span>Najrýchlejšie recepty</span>
              </div>
            </a>
          </Link>
          <SWRConfig
            value={{
              fallback,
              fetcher: recipesFastestFetcher,
              onError: () =>
                toast({ type: 'error', message: 'Načítanie receptov zlyhalo' }),
            }}
          >
            <RecipesVertical />
          </SWRConfig>
        </div>
        <div className='my-4'>
          <Teaser
            reversed={true}
            title='Máte chuť recept zdieľať ?'
            description={
              <>
                Pre zdieľanie receptu použite tlačidlá pri detaile receptu v
                hornej časti obrazovky. Recept je možné zdieľať aj
                prostredníctvom sociálnych sietí, poprípade si ho nechať
                vytlačiť. Chutné zdieľanie 📬
              </>
            }
          >
            <RecipeSocials
              parentClassName='justify-center'
              url={basePath}
              image={`${basePath}/images/meals.svg`}
              quote='Neviete sa rozhodnúť čo dnes na obed alebo večeru? Potom je tu pre Vás zoznam našich obľúbených a jednoduchých receptov'
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
            Zobraziť všetky
          </span>
          <span className='text-base underline font-light text-white'>
            Najnovšie recepty
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
            Zobraziť všetky
          </span>
          <span className='text-base underline font-light text-white'>
            Najrýchlejšie recepty
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
            Zobraziť všetky
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
