import { useSWRInfinite } from 'swr';

function useInfiniteScroll(getKey, fetcher, resourceName, PAGE_SIZE) {
  const { data, isValidating, size, setSize, error } = useSWRInfinite(getKey, fetcher);

  const fetchMore = () => setSize(size + 1);

  const results = data ? [].concat(...data.map((obj) => obj[resourceName])) : [];

  const isLoadingInitialData = !data && !error;

  const isLoadingMore =
    isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === 'undefined');

  const isEmpty = data?.[0]?.[resourceName]?.length === 0;

  const isReachingEnd = !!(
    isEmpty ||
    (data && data[data.length - 1]?.[resourceName]?.length < PAGE_SIZE)
  );
  const isRefreshing = !!(isValidating && data && data.length === size);

  return {
    error,
    results,
    isLoadingInitialData,
    isLoadingMore,
    isReachingEnd,
    isRefreshing,
    isEmpty,
    size,
    fetchMore
  };
}

export { useInfiniteScroll };