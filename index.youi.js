import React from 'react';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import AppComponent from './app/AppComponent';

const YiReactApp = () => (
  <AppComponent />
);

AppRegistry.registerComponent(appName, () => YiReactApp);
