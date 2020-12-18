import useSWR, { mutate } from 'swr';

export default function createCrudHooks({
  baseKey,
  indexFn,
  singleFn,
  createFn,
  updateFn,
  deleteFn
}) {
  const useIndex = () => {};

  const useSingle = () => {};

  const useCreate = () => {};

  const useUpdate = () => {};

  const useDelete = () => {};

  return [useIndex, useSingle, useCreate, useUpdate, useDelete];
}
