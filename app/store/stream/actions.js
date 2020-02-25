import { NEXT, PREV } from './types';

export const nextStream = () => {
  return {
    type: NEXT,
    payload: {},
  };
};

export const prevStream = () => {
  return {
    type: PREV,
    payload: {},
  };
};
