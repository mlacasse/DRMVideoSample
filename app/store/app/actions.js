import { ERROR } from './types';

export const setError = ({ error }) => {
  return {
    type: ERROR,
    payload: { error },
  };
};
