import Head from 'next/head';
import { useContext } from 'react';
import { ConfigContext } from './config-provider';

interface AddApiPrefetchProps {
  paths: string[];
}

export const AddApiPrefetch = (props: AddApiPrefetchProps) => {
  const { config } = useContext(ConfigContext);
  return (
    <Head>
      {props.paths
        .map((path) => `https://${config?.ApiDomainName}${path}`)
        .map((path) => (
          <link
            key={`prefetch-${path}`}
            rel="preload"
            href={path}
            as="fetch"
            crossOrigin="anonymous"
          />
        ))}
    </Head>
  );
};
