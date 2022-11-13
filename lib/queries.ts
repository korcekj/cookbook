import { groq } from 'next-sanity';
import { OrderKey, OrderDir } from '@lib/constants';
import { inEnum } from '@lib/utils';

interface QueryProps {
  orderPairs: { orderKey: OrderKey; orderDir: OrderDir }[];
}

const buildOrderQuery = ({ orderPairs }: QueryProps) => {
  return orderPairs
    .filter(
      ({ orderKey, orderDir }) =>
        inEnum(OrderKey, orderKey) && inEnum(OrderDir, orderDir)
    )
    .map(({ orderKey, orderDir }) => `| order(${orderKey} ${orderDir})`)
    .join(' ');
};

export const recipesQuery = ({ orderPairs }: QueryProps) => groq`
  *[_type=="recipe" && !(_id in path("drafts.**"))] ${buildOrderQuery({
    orderPairs,
  })} {
    ...,
    author->,
    category->
  }[$from...$to]
`;

export const recipesSearchQuery = ({ orderPairs }: QueryProps) => groq`
  *[_type=="recipe" && !(_id in path("drafts.**")) && [title, description] match [$search]] | score(
    boost(title match $search, 2),
    boost(description match $search, 1)
  ) ${buildOrderQuery({ orderPairs })} {
    ...,
    author->,
    category->
  }[$from...$to]
`;

export const recipesCountQuery = () => groq`
  count(*[_type=="recipe" && !(_id in path("drafts.**"))])
`;

export const recipesSearchCountQuery = () => groq`
count(*[_type=="recipe" && !(_id in path("drafts.**")) && [title, description] match [$search]])
`;

export const recipeSlugQuery = () => groq`
  *[_type=="recipe" && !(_id in path("drafts.**")) && slug.current == $slug] {
    ...,
    author->,
    category->
  }[0]
`;

export const recipeSlugsQuery = () => groq`
  *[_type == "recipe" && defined(slug.current)][].slug.current
`;

export const recipesPerCategoriesQuery = ({ orderPairs }: QueryProps) => groq`
  *[_type=="category" && !(_id in path("drafts.**"))] ${buildOrderQuery({
    orderPairs,
  })} {
    ...*[_type == "recipe" && references(^._id) && !(_id in path("drafts.**"))]{..., author->, category->} | order(${
      OrderKey.CREATED_AT
    } ${OrderDir.DESC})[0]
  }[$from...$to]
`;

export const recipesPerCategoriesCountQuery = () => groq`
  count(*[_type=="category" && !(_id in path("drafts.**"))] {
    ...*[_type == "recipe" && references(^._id) && !(_id in path("drafts.**"))][0]
  })
`;

export const recipesPerCategoryQuery = ({ orderPairs }: QueryProps) => groq`
  *[_type=="category" && !(_id in path("drafts.**")) && slug.current == $slug] {
    "recipes": *[_type == "recipe" && references(^._id) && !(_id in path("drafts.**"))]{..., author->, category->} ${buildOrderQuery(
      { orderPairs }
    )}[$from...$to]
  }[0].recipes
`;

export const recipesPerCategoryExceptRecipeQuery = ({
  orderPairs,
}: QueryProps) => groq`
  *[_type=="category" && !(_id in path("drafts.**")) && slug.current == $categorySlug] {
    "recipes": *[_type == "recipe" && references(^._id) && !(_id in path("drafts.**")) && slug.current != $recipeSlug]{..., author->, category->} ${buildOrderQuery(
      { orderPairs }
    )}[$from...$to]
  }[0].recipes
`;

export const recipesPerCategoryCountQuery = () => groq`
  count(*[_type=="category" && !(_id in path("drafts.**")) && slug.current == $slug] {
    "recipes": *[_type == "recipe" && references(^._id) && !(_id in path("drafts.**"))]
  }[0].recipes)
`;

export const categoriesQuery = ({ orderPairs }: QueryProps) => groq`
  *[_type=="category" && !(_id in path("drafts.**"))] ${buildOrderQuery({
    orderPairs,
  })}[$from...$to]
`;

export const categoriesCountQuery = () => groq`
  count(*[_type=="category" && !(_id in path("drafts.**"))])
`;

export const categorySlugQuery = () => groq`
  *[_type=="category" && !(_id in path("drafts.**")) && slug.current == $slug][0]
`;

export const categorySlugsQuery = () => groq`
  *[_type == "category" && defined(slug.current)][].slug.current
`;

export const categoriesRecipesCountQuery = ({ orderPairs }: QueryProps) => groq`
  *[_type=="category" && !(_id in path("drafts.**"))] {
    ...,
    "recipesCount": count(*[_type == "recipe" && references(^._id) && !(_id in path("drafts.**"))])
  } ${buildOrderQuery({ orderPairs })}[$from...$to]
`;

export const categoriesRecipesExceptCategoryCountQuery = ({
  orderPairs,
}: QueryProps) => groq`
  *[_type=="category" && !(_id in path("drafts.**")) && slug.current != $slug] {
    ...,
    "recipesCount": count(*[_type == "recipe" && references(^._id) && !(_id in path("drafts.**"))])
  } ${buildOrderQuery({ orderPairs })}[$from...$to]
`;
