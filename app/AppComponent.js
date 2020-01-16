import React, { PureComponent } from 'react';
import { View, NativeModules, NativeEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { DeviceInfo, Input } from '@youi/react-native-youi';
import { ACVideo, ACScaler, withFairplay, withPassthrough, withWidevine } from './components';

import { CLEARStream } from './store/stream';

const { Dimensions, OrientationLock } = NativeModules;

class AppComponent extends PureComponent {
  constructor(props) {
    super(props);

    const { width, height } = Dimensions.window;

    this.state = {
      isClear: false,
      streamInfo: this.props.streamInfo,
      controlsUp: false,
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

    OrientationLock.setRotationMode(6);

    this.dimensionsChangeEvent = new NativeEventEmitter(Dimensions);
  }

  componentDidMount = () => {
    this.dimensionsChangeEvent.addListener('change', this.handleOnOrientationChange);

    Input.addEventListener('ArrowLeft', this.handleOnSwipeLeft);
    Input.addEventListener('ArrowRight', this.handleOnSwipeRight);
  };

  componentDidUnmount = () => {
    this.dimensionsChangeEvent.removeListener('change', this.handleOnOrientationChange);

    Input.removeEventListener('ArrowLeft', this.handleOnSwipeLeft);
    Input.removeEventListener('ArrowRight', this.handleOnSwipeRight);
  };

  getStatistics = statistics => {
    console.log(statistics);
  };

  handleOnOrientationChange = ({ window })=> {
    this.setState({ window });
  };

  handleOnStateChanged = playerState => {
    console.log(playerState.nativeEvent);
  };

  handleOnTimedMetadata = metadata => {
    console.log(metadata.nativeEvent);
  };

  handleOnSwipeRight = () => {
    if (this.state.controlsUp) return;

    this.setState({ streamInfo: CLEARStream });
  };

  handleOnSwipeLeft = () => {
    if (this.state.controlsUp) return;

    this.setState({ streamInfo: this.props.streamInfo });
  };

  handleOnTap = () => {
    this.setState({ controlsUp: !this.state.controlsUp });
  }

  render() {
    const { width, height } = this.state.window;

    return(
      <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
        <ACScaler
          xRatio={16} 
          yRatio={9}
          screenDimensions={{ width, height }}
        >
          <ACVideo 
            source={this.state.streamInfo}
            continuous={1}
            maxBitrate={400000}
            bufferLength={{
              min: 5000,
              max: 15000,
            }}
            onTimedMetadata={this.handleOnTimedMetadata}
            onStateChanged={this.handleOnStateChanged}
            onSwipeLeft={this.handleOnSwipeLeft}
            onSwipeRight={this.handleOnSwipeRight}
            onTap={this.handleOnTap}
            getStatistics={this.getStatistics}
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
