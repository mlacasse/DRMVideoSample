import { FAIRPLAY_INFO, SPC_MESSAGE } from './types';

export default (state = {}, action) => {
  switch(action.type) {
    case FAIRPLAY_INFO:
      return { ...state, tag: action.payload.tag, fairplayInfo: action.payload.fairplayInfo };
    case SPC_MESSAGE:
      return { ...state, tag: action.payload.tag, spcMessage: action.payload.spcMessage };
    default:
      return state;
  }
};
