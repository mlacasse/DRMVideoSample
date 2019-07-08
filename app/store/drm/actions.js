import { FAIRPLAY_INFO, SPC_MESSAGE } from './types';

export const setFairplayInfo = ({ fairplayInfo }) => {
  return {
    type: FAIRPLAY_INFO,
    payload: { fairplayInfo }
  };
};

export const setSPCMessage = ({ spcMessage }) => {
  return {
    type: SPC_MESSAGE,
    payload: { spcMessage }
  };
};
