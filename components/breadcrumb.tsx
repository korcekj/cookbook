import type { FC } from 'react';

import useSWR from 'swr';
import { memo } from 'react';
import { upperFirst } from 'lodash';

import Link from 'next/link';

interface BreadcrumbProps {
  href: string;
  last?: boolean;
  textFetcher: () => Promise<string>;
}

const Breadcrumb: FC<BreadcrumbProps> = ({ last, href, textFetcher }) => {
  const { data: text } = useSWR(['/breadcrumb', href], textFetcher);

  if (!text) return null;
  else if (last) return <li className='line-clamp-1'>{upperFirst(text)}</li>;
  else
    return (
      <>
        <li>
          <Link href={href}>
            <a className='font-bold'>{upperFirst(text)}</a>
          </Link>
        </li>
        <li>/</li>
      </>
    );
};

export default memo(Breadcrumb);
