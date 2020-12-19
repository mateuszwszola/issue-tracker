import useSWR, { mutate } from 'swr';

/* 
  Inspired by createCrudHooks for react-query
  https://gist.github.com/tannerlinsley/c6c0064239e0bcf40ca3703f95c0fb11
*/

export default function createCrudHooks({
  baseKey,
  indexFn,
  singleFn,
  createFn,
  updateFn,
  deleteFn
}) {
  const useIndex = (url, config) => useSWR(url, indexFn, config);

  const useSingle = (url, config) => useSWR(url, singleFn, config);

  const useCreate = (config = {}) => async () => {
    try {
      const data = await createFn();

      mutate([baseKey]);

      if (config.onSuccess) config.onSuccess(data);
    } catch (err) {
      if (config.onError) config.onError(err);

      Promise.reject(err);
    }
  };

  const useUpdate = (config = {}) => async () => {
    try {
      const data = await updateFn();

      mutate([baseKey]);

      if (config.onSuccess) config.onSuccess(data);
    } catch (err) {
      if (config.onError) config.onError(err);

      Promise.reject(err);
    }
  };

  const useDelete = (config = {}) => async () => {
    try {
      const data = await deleteFn();

      mutate([baseKey]);

      if (config.onSuccess) config.onSuccess(data);
    } catch (err) {
      if (config.onError) config.onError(err);

      Promise.reject(err);
    }
  };

  return [useIndex, useSingle, useCreate, useUpdate, useDelete];
}
