import React, { Fragment, PureComponent } from 'react';
import { View, NativeModules, NativeEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { DeviceInfo, Input, FormFactor } from '@youi/react-native-youi';
import { ACButton, ACVideo, ACGoogleCast, ACScaler, withFairplay, withPassthrough, withWidevine } from './components';

import { CLEARStream } from './store/stream';

const GoogleCastIcon = { 'uri': 'res://drawable/default/chromecast.png' };

const { Dimensions, OrientationLock, GoogleCast } = NativeModules;

class AppComponent extends PureComponent {
  constructor(props) {
    super(props);

    const { width, height } = Dimensions.window;

    this.state = {
      ignoreSwipe: false,
      isCasting: false,
      streamInfo: this.props.streamInfo,
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
    this.interval = null;
  }

  componentDidMount = () => {
    this.dimensionsChangeEvent.addListener('change', this.handleOnOrientationChange);

    Input.addEventListener('ArrowLeft', this.handleOnSwipeLeft);
    Input.addEventListener('ArrowRight', this.handleOnSwipeRight);

    this.interval = setInterval(() => {
      GoogleCast.getAvailableDevices()
        .then(devices => console.log('GoogleCast', Object.values(devices)))
    }, 5000);
  };

  componentWillUnmount = () => {
    this.dimensionsChangeEvent.removeListener('change', this.handleOnOrientationChange);

    Input.removeEventListener('ArrowLeft', this.handleOnSwipeLeft);
    Input.removeEventListener('ArrowRight', this.handleOnSwipeRight);

    clearInterval(this.interval);
  };

  handleOnOrientationChange = ({ window })=> {
    this.setState({ window });
  };

  handleOnSwipeRight = () => {
    if (this.state.ignoreSwipe) return;

    this.setState({ streamInfo: CLEARStream });
  };

  handleOnSwipeLeft = () => {
    if (this.state.ignoreSwipe) return;

    this.setState({ streamInfo: this.props.streamInfo });
  };

  handleOnTap = () => {
    this.setState({ ignoreSwipe: !this.state.ignoreSwipe });
  };

  handleOnCast = () => {
    this.setState({ isCasting: !this.state.isCasting, ignoreSwipe: false });  
  };

  renderGoogleCastControl = () => {
    const { width } = this.state.window;

    if (!this.state.isCasting && !this.state.ignoreSwipe) return null;

    return (
      <View style={{ width, position: 'absolute', alignItems: 'flex-end' }}>
        <ACButton source={GoogleCastIcon} style={Styles.GoogleCastIconStyle} onPress={this.handleOnCast} />
      </View>
    );
  };

  renderVideoPlayer = () => {
    const { streamInfo } = this.state;

    return (
      <ACVideo 
        source={streamInfo}
        continuous={1}
        maxBitrate={400000}
        bufferLength={{
          min: 5000,
          max: 15000,
        }}
        onSwipeLeft={this.handleOnSwipeLeft}
        onSwipeRight={this.handleOnSwipeRight}
        onTap={this.handleOnTap}
      />
    );
  };

  renderGoogleCastPlayer = () => {
    const { streamInfo } = this.state;

    return (
      <ACGoogleCast source={streamInfo} />
    );
  };

  render() {
    const { isCasting, window } = this.state;

    const { width, height } = window;

    return(
      <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
        <ACScaler
          xRatio={16} 
          yRatio={9}
          screenDimensions={{ width, height }}
        >
          {isCasting ? this.renderGoogleCastPlayer() : this.renderVideoPlayer()}          
        </ACScaler>
        {this.renderGoogleCastControl()}
      </View>
    );
  }
};

const Styles = {
  GoogleCastIconStyle: {
    width: FormFactor.isTV ? 180 : 50,
    height: FormFactor.isTV ? 144 : 40,
    marginRight: 40,
    marginTop: 30,
  },
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
