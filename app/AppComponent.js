import React, { Component } from 'react';
import { NativeModules } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { DeviceInfo } from '@youi/react-native-youi';
import { ACVideo, withFairplay, withPassthrough, withWidevine } from './components';

class AppComponent extends Component {
  state = {}

  constructor() {
    super();
  }

  componentWillMount() {
    NativeModules.OrientationLock.setRotationMode(0); // Lock Landscape
  }

  render() {
    return(
      <ACVideo 
        style={{ width: '100%', height: '100%' }}
        source={this.props.streamInfo}
        continuous={1}
      />
    );
  }
};

const mapStateToProps = state => {
  const { streamInfo } = state;

  return { streamInfo };
};

const conditionalDRMHandler = () => {
  if (DeviceInfo.getDeviceModel() === 'Simulator') {
    return withPassthrough;
  }

  switch(DeviceInfo.getSystemName()) {
    case 'iOS':
    case 'tvOS':
      return withFairplay;
    case 'android':
      return withWidevine;
    default:
      return withPassthrough;
  }
};

export default compose(
  connect(mapStateToProps),
  conditionalDRMHandler()
  )(AppComponent);
