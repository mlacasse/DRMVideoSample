import React from 'react';
import { Provider } from 'react-redux';
import { AppRegistry } from 'react-native';
import AppComponent from './app/AppComponent';

import store from './app/store';
import { name as appName } from './app.json';

const YiReactApp = () => (
  <Provider store={store}>
    <AppComponent />
  </Provider>
);

AppRegistry.registerComponent(appName, () => YiReactApp);
