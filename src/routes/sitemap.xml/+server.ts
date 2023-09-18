import type { Sitemap } from '$lib/types';

import { cacheAge } from '$lib/config';
import { PUBLIC_BASE_URL } from '$env/static/public';
import { getRecipes, getCategories } from '$lib/utils/recipes';

export const prerender = true;

export const GET = async () => {
	const recipes = getRecipes();
	const categories = getCategories();
	const pages = ['recipes/1'];

	return new Response(sitemap({ pages, recipes, categories }), {
		headers: {
			'Content-Type': 'application/xml',
			'cache-control': `public, s-maxage=${cacheAge}`
		}
	});
};

const sitemap = ({ pages, recipes, categories }: Sitemap) =>
	`
<?xml version="1.0" encoding="UTF-8" ?>
<urlset
    xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xhtml="https://www.w3.org/1999/xhtml"
    xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
    xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
    xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
    xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
>
<url>
<loc>${PUBLIC_BASE_URL}</loc>
<changefreq>daily</changefreq>
<priority>0.7</priority>
</url>
${pages
	.map(
		(page) => `<url>
<loc>${PUBLIC_BASE_URL}/${page}</loc>
<changefreq>daily</changefreq>
<priority>0.7</priority>
</url>`
	)
	.join('')}
${recipes
	.map(
		({ slug }) => `<url>
  <loc>${PUBLIC_BASE_URL}/recipes/${slug}</loc>
  <changefreq>daily</changefreq>
  <priority>0.7</priority>
  </url>`
	)
	.join('')}
${categories
	.map(
		({ slug }) => `<url>
    <loc>${PUBLIC_BASE_URL}/categories/${slug}/1</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
    </url>`
	)
	.join('')}
</urlset>`.trim();
