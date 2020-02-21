import React, { PureComponent } from 'react';
import { View, NativeModules, NativeEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { DeviceInfo, Input, FormFactor } from '@youi/react-native-youi';
import { ACButton, ACVideo, ACGoogleCast, ACPicker, ACScaler, withFairplay, withPassthrough, withWidevine } from './components';

import stream from './store/stream';

const GoogleCastIcon = { 'uri': 'res://drawable/default/chromecast.png' };

const { Dimensions, OrientationLock, GoogleCast } = NativeModules;

const localDevice = {
  uniqueId: undefined,
  friendlyName: `${FormFactor.isHandset ? 'Phone' : 'Tablet'} (this device)`,
};

class AppComponent extends PureComponent {
  constructor(props) {
    super(props);

    const { width, height } = Dimensions.window;

    this.index = 0;

    this.state = {
      showReceivers: false,
      ignoreSwipe: false,
      isCasting: false,
      streamInfo: this.props.streams[this.index],
      window: {
        width,  
        height,
      },
      receivers: [],
      receiver: undefined,
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
        .then(devices => {
          this.setState({ receivers: Object.values(devices) })
        })
    }, 1000);

    console.log(this.index, this.props.streams[this.index]);
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

    const { streams } = this.props;

    this.index--;

    if (this.index <= 0) {
      this.index = streams.length - 1;
    }

    console.log(this.index, streams[this.index]);

    this.setState({ streamInfo: streams[this.index] });
  };

  handleOnSwipeLeft = () => {
    if (this.state.ignoreSwipe) return;

    const { streams } = this.props;

    this.index++;

    if (this.index >= streams.length) {
      this.index = 0;
    }

    console.log(this.index, streams[this.index]);

    this.setState({ streamInfo: streams[this.index] });
  };

  handleOnTap = () => {
    this.setState({ ignoreSwipe: !this.state.ignoreSwipe });
  };

  handleOnPressGoogleCastControl = () => {
    const { showReceivers } = this.state;

    this.setState({ showReceivers: !showReceivers });
  };

  handleOnCast = uniqueId => {
    const isCasting = uniqueId ? true : false;

    this.setState({ isCasting, receiver: uniqueId, showReceivers: false, ignoreSwipe: false });  
  };

  renderGoogleCastReceivers = () => {
    const { receivers, showReceivers } = this.state;

    if (!showReceivers) return null;

    const devices = [ localDevice, ...receivers ];

    return (
      <ACPicker style={Styles.PickerStyle} data={devices} onPress={this.handleOnCast} />
    );
  };

  renderGoogleCastControl = () => {
    const { width } = this.state.window;

    if (!this.state.isCasting && !this.state.ignoreSwipe) return null;

    return (
      <View style={{ width, position: 'absolute', alignItems: 'flex-end' }}>
        <ACButton source={GoogleCastIcon} style={Styles.GoogleCastIconStyle} onPress={this.handleOnPressGoogleCastControl} />
        {this.renderGoogleCastReceivers()}
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
    const { streamInfo, receiver } = this.state;

    return (
      <ACGoogleCast source={streamInfo} receiver={receiver}/>
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
  PickerStyle: {
    borderRadius: '5',
    borderColor: '#DEDEDE',
    borderWidth: '1',
    padding: '10',
    backgroundColor: 'black',
    marginRight: FormFactor.isTV ? 50 : 90,
    marginTop: FormFactor.isTV ? 0 : 30,
    height: '300',
  },
  GoogleCastIconStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: FormFactor.isTV ? 100 : 50,
    height: FormFactor.isTV ? 80 : 40,
    marginRight: FormFactor.isTV ? 0 : 40,
    marginTop: FormFactor.isTV ? 0 : 30,
  },
};

const mapStateToProps = state => {
  const { streams } = state;

  return { streams };
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
