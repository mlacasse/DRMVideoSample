import React, { Component } from 'react';
import { View, NativeModules, NativeEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { DeviceInfo } from '@youi/react-native-youi';
import { ACVideo, ACScaler, ACSwipe, withFairplay, withPassthrough, withWidevine } from './components';

const { Dimensions } = NativeModules;

class AppComponent extends Component {
  constructor(props) {
    super(props);

    const { width, height } = Dimensions.window;

    this.state = {
      window: {
        width,
        height,
      },
    };

    // 0 = Landscape
    // 1 = Portrait
    // 2 = Auto
    // 3 = LandscapeRight
    // 4 = LandscapeLeft
    // 5 = PortraitUpright
    // 6 = AutoUpright

    NativeModules.OrientationLock.setRotationMode(6);

    this.dimensionsChangeEvent = new NativeEventEmitter(Dimensions);
  }

  componentWillMount = () => {
    this.dimensionsChangeEvent.addListener('change', this.handleOnOrientationChange);
  }

  componentWillUnmount = () => {
    this.dimensionsChangeEvent.removeListener('change', this.handleOnOrientationChange);
  }

  handleOnOrientationChange = ({ window }) => {
    this.setState({ window });
  }

  render() {
    const { width, height } = this.state.window;

    return(
      <View style={{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <ACScaler
          xRatio={16}
          yRatio={9}
          screenDimensions={{ width, height }}
        >
          <ACVideo 
            style={{ width: '100%', height: '100%' }}
            source={this.props.streamInfo}
            continuous={1}
          />
        </ACScaler>
      </View>
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
