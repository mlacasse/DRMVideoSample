import { createStore, combineReducers, applyMiddleware } from 'redux';
import appReducer from './app';
import streamReducer from './stream';
import drmReducer from './drm';

import thunk from 'redux-thunk';

const store = createStore(combineReducers({
    app: appReducer,
    streams: streamReducer,
    drm: drmReducer
}), applyMiddleware(thunk));

export default store;