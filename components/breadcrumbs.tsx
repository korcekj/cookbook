import type { FC } from 'react';
import type { Recipe, Category } from '@lib/sanity.schema';

import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { sanityClient } from '@lib/sanity';
import { recipeSlugQuery, categorySlugQuery } from '@lib/queries';
import classNames from 'classnames';

import Breadcrumb from '@components/breadcrumb';

const generatePathParts = (pathStr: string) => {
  const pathWithoutQuery = pathStr.split('?')[0].split('#')[0];
  return pathWithoutQuery.split('/').filter((v) => v.length > 0);
};

const textGenerators: {
  [key: string]: (arg?: string) => Promise<string>;
} = {
  home: () => Promise.resolve('domov'),
  search: () => Promise.resolve('vyhľadávanie'),
  recipes: () => Promise.resolve('recepty'),
  categories: () => Promise.resolve('kategórie'),
  recipe: (slug?: string) =>
    new Promise<string>((resolve) =>
      sanityClient
        .fetch(recipeSlugQuery(), { slug })
        .then((recipe?: Recipe) => resolve(recipe?.title || ''))
    ),
  category: (slug?: string) =>
    new Promise<string>((resolve) =>
      sanityClient
        .fetch(categorySlugQuery(), { slug })
        .then((category?: Category) => resolve(category?.title || ''))
    ),
};

const Breadcrumbs: FC = () => {
  const router = useRouter();

  const breadcrumbs = useMemo(() => {
    const asPathParts = generatePathParts(router.asPath);
    const pathnameParts = generatePathParts(router.pathname);

    const crumbs = asPathParts
      .filter((_, i) => {
        const pathParam = pathnameParts[i]?.replace('[', '')?.replace(']', '');
        return !!textGenerators[pathParam];
      })
      .map((pathPart, i) => {
        const href = '/' + asPathParts.slice(0, i + 1).join('/');
        const pathParam = pathnameParts[i]?.replace('[', '')?.replace(']', '');
        const textFetcher = () => textGenerators[pathParam](pathPart);
        return { href, textFetcher };
      });

    return [
      { href: '/', textFetcher: () => textGenerators['home']() },
      ...crumbs,
    ];
  }, [router.asPath, router.pathname]);

  return (
    <nav
      className={classNames(
        'flex',
        'text-left',
        'text-emerald-700',
        'bg-emerald-400/10',
        'items-center',
        'px-4',
        'py-3',
        'rounded-md',
        'print:hidden',
        {
          hidden: breadcrumbs.length === 1,
        }
      )}
    >
      <ul className='flex items-center gap-x-2 '>
        {breadcrumbs.map((breadcrumb, i) => (
          <Breadcrumb
            key={i}
            {...breadcrumb}
            last={i === breadcrumbs.length - 1}
          />
        ))}
      </ul>
    </nav>
  );
};

export default Breadcrumbs;
