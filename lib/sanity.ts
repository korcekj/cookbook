import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

import { createClient, createImageUrlBuilder } from 'next-sanity';
import { config } from './sanity.config';

export const sanityClient = createClient(config);

export const urlFor = (source: SanityImageSource) =>
  createImageUrlBuilder(config).image(source).auto('format').fit('max');
