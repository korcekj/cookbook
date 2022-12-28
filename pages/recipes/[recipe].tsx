import type { NextPage, GetStaticPaths, GetStaticProps } from 'next';
import type { Recipe, Category, Author } from '@lib/sanity.schema';

import { useRouter } from 'next/router';
import { sanityClient, urlFor } from '@lib/sanity';
import {
  recipeSlugQuery,
  recipeSlugsQuery,
  recipesPerCategoryExceptRecipeQuery,
} from '@lib/queries';
import { RECIPES_LIMIT, OrderKey, OrderDir } from '@lib/constants';
import { humanizeMinutes } from '@lib/moment';
import useBasePath from '@hooks/useBasePath';

import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import RecipesLinear from '@components/recipes-linear';
import RecipeCard from '@components/recipe-card';
import RecipeSocials from '@components/recipe-socials';
import CardPlaceholder from '@components/card-placeholder';
import Sections from '@components/sections';

import { ArrowCircleRightIcon } from '@heroicons/react/outline';
import { ArrowLeftIcon } from '@heroicons/react/outline';
import { HashtagIcon } from '@heroicons/react/solid';
import { UsersIcon } from '@heroicons/react/solid';
import { CakeIcon } from '@heroicons/react/solid';

type Undefinable<T> = T | undefined;

interface RecipePageProps {
  recipe: Recipe;
  recipes: Recipe[];
}

const RecipePage: NextPage<RecipePageProps> = ({ recipe, recipes }) => {
  const router = useRouter();
  const basePath = useBasePath();

  const author = recipe.author as Undefinable<Author>;
  const category = recipe.category as Undefinable<Category>;

  return (
    <>
      <Head>
        <title>CookBook - {recipe.title}</title>
        {author && <meta name='author' content={author.name} />}
        <meta name='description' content={recipe.description} />
        <meta property='og:title' content={recipe.title} />
        <meta property='og:description' content={recipe.description} />
        {recipe.image && (
          <meta
            property='og:image'
            content={urlFor(recipe.image.asset).url()!}
          />
        )}
      </Head>
      <div className='py-4 space-y-4'>
        <div className='relative h-48 md:h-96 lg:h-[28rem] xl:h-[32rem]'>
          <div className='flex absolute top-4 left-4 z-10 print:hidden'>
            <a
              className='text-white bg-gray-900/50 rounded p-2 hover:bg-gray-900/70 hover:cursor-pointer'
              onClick={() => router.back()}
            >
              <ArrowLeftIcon className='w-6 h-6' />
            </a>
          </div>
          <div className='flex items-center space-x-2 absolute top-4 right-4 z-10 print:hidden'>
            {recipe.image && (
              <RecipeSocials
                url={`${basePath}/recipes/${recipe.slug?.current}`}
                image={urlFor(recipe.image.asset).url()!}
                quote={recipe.description}
              />
            )}
          </div>
          {!!recipe.image?.asset && (
            <Image
              className='rounded'
              src={urlFor(recipe.image.asset).url()!}
              alt={recipe.title}
              layout='fill'
              objectFit='cover'
              placeholder='blur'
              blurDataURL={
                urlFor(recipe.image.asset).quality(10).blur(50).url()!
              }
            />
          )}
        </div>
        <div>
          <h1 className='text-3xl font-semibold text-gray-900'>
            {recipe.title}
          </h1>
        </div>
        <div className='flex items-center space-x-2'>
          {!!author?.image?.asset && (
            <div className='w-10 h-10'>
              <Image
                className='rounded-full'
                src={urlFor(author.image.asset).url()!}
                alt={author.name}
                layout='fixed'
                width={40}
                height={40}
                title={author.name}
              />
            </div>
          )}
          <p className='px-2 border-l border-gray-300 leading-relaxed text-base font-light text-gray-700 text-justify'>
            {recipe.description}
          </p>
        </div>
        <div>
          <div className='flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0'>
            <div className='flex items-center space-x-2 p-2 bg-emerald-900/80 text-white rounded print:bg-white print:text-gray-900'>
              {recipe.servings?.type === 'portions' && (
                <UsersIcon className='w-4 h-4' />
              )}
              {recipe.servings?.type === 'pieces' && (
                <CakeIcon className='w-4 h-4' />
              )}
              <span className='font-medium'>{recipe.servings?.size}</span>
            </div>
            <span className='p-2 font-medium bg-emerald-400/10 text-emerald-900 rounded print:bg-white print:text-gray-900'>
              {category?.title}
            </span>
            <div className='flex items-center space-x-2 p-2 bg-gray-400/10 text-gray-900 rounded print:bg-white print:text-gray-900'>
              <span>Čas prípravy:</span>
              <span className='font-medium'>
                {humanizeMinutes(recipe.preparation)}
              </span>
            </div>
            <div className='flex items-center space-x-2 p-2 bg-gray-400/10 text-gray-900 rounded print:bg-white print:text-gray-900'>
              <span>Čas varenia:</span>
              <span className='font-medium'>
                {humanizeMinutes(recipe.cook)}
              </span>
            </div>
          </div>
        </div>
        <Sections sections={recipe.sections} servings={recipe.servings} />
      </div>
      {recipes.length > 0 && (
        <div className='print:hidden'>
          <Link href={`#${category?.slug?.current}`}>
            <a
              id={category?.slug?.current}
              className='inline-block text-2xl font-semibold text-gray-900'
            >
              <div className='flex items-center space-x-1'>
                <HashtagIcon className='flex-none w-5 h-5 text-gray-500' />
                <h2>Tiež by Vás mohlo zaujímať</h2>
              </div>
            </a>
          </Link>
          <RecipesLinear>
            {recipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
            <CardPlaceholder
              to={{
                pathname: `/categories/${category?.slug?.current}`,
              }}
              imgSrc='/images/meals.svg'
              imgAlt='recipes'
            >
              <div className='flex flex-col gap-y-1 items-center'>
                <span className='text-2xl font-semibold text-white'>
                  Zobraziť všetky
                </span>
                <span className='text-base underline font-light text-white'>
                  {category?.title}
                </span>
                <ArrowCircleRightIcon className='mt-4 w-10 h-10 text-white group-hover:scale-105 transition-transform' />
              </div>
            </CardPlaceholder>
          </RecipesLinear>
        </div>
      )}
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const recipeSlug = params?.recipe as string;
  const recipe: Recipe = await sanityClient.fetch(recipeSlugQuery(), {
    slug: recipeSlug,
  });

  if (!recipe) return { notFound: true };

  const categorySlug = (recipe.category as Undefinable<Category>)?.slug
    ?.current;
  const recipes: Recipe[] = await sanityClient.fetch(
    recipesPerCategoryExceptRecipeQuery({
      orderPairs: [{ orderKey: OrderKey.CREATED_AT, orderDir: OrderDir.DESC }],
    }),
    {
      recipeSlug,
      categorySlug,
      from: 0,
      to: RECIPES_LIMIT,
    }
  );

  return {
    props: {
      recipe,
      recipes,
    },
    revalidate: 60,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: string[] = await sanityClient.fetch(recipeSlugsQuery());
  return {
    paths: paths.map((recipe) => ({ params: { recipe } })),
    fallback: 'blocking',
  };
};

export default RecipePage;
