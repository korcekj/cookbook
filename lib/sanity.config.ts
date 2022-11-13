import type { ClientConfig } from 'next-sanity';

export const config: ClientConfig = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_VERSION,
  useCdn: process.env.NODE_ENV === 'production',
};
