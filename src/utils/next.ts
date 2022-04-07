import type { Redirect } from 'next';

export const redirect = (destination: string = '/'): { redirect: Redirect } => {
  return {
    redirect: { destination, permanent: false },
  };
};

export const parseServerData = <T extends unknown>(data: T) =>
  JSON.parse(JSON.stringify(data)) as T;

export const getQueryString = (q: string | string[] | undefined) =>
  q ? decodeURI(q.toString()) : undefined;
