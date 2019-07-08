import React, { Component } from 'react';
import { Dimensions, NativeModules } from 'react-native';
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
    const { width, height } = Dimensions.get('window');

    return(
      <ACVideo 
        style={{ width, height }}
        source={this.props.streamInfo}
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
