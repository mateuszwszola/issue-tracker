import { useCallback, useReducer } from 'react';

const initialState = {
  status: 'idle',
  error: null,
  data: null
};

const reducer = (state, action) => {
  if (action.type === 'started') {
    return {
      ...initialState,
      status: 'loading'
    };
  } else if (action.type === 'success') {
    return {
      ...initialState,
      status: 'success',
      data: action.payload.data
    };
  } else if (action.type === 'error') {
    return {
      ...initialState,
      error: action.payload.error
    };
  } else {
    return state;
  }
};

const useAsync = ({ promiseFn }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { status, error, data } = state;

  const run = useCallback(() => {
    const requestStarted = () => dispatch({ type: 'started' });

    const requestSuccessful = (response) =>
      dispatch({ type: 'success', payload: { data: response } });

    const requestFailed = (error) => dispatch({ type: 'error', payload: { error } });

    requestStarted();

    return promiseFn().then(requestSuccessful).catch(requestFailed);
  }, [promiseFn]);

  return { run, isLoading: status === 'loading', error, data };
};

export default useAsync;
