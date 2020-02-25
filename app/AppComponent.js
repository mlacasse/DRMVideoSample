import React, { PureComponent } from 'react';
import { View, NativeModules, NativeEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { DeviceInfo, Input, FormFactor } from '@youi/react-native-youi';
import { ACButton, ACVideo, ACGoogleCast, ACPicker, ACScaler, withFairplay, withPassthrough, withWidevine } from './components';

import { nextStream, prevStream } from './store/stream/actions';

const GoogleCastIcon = { 'uri': 'res://drawable/default/chromecast.png' };
const AirplayIcon = { 'uri': 'res://drawable/default/airplay.png' };

const { OrientationLock, GoogleCast, Airplay, PlatformConstants } = NativeModules;

const localDevice = {
  uniqueId: undefined,
  friendlyName: `${FormFactor.isHandset ? 'Phone' : 'Tablet'} (this device)`,
};

class AppComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showReceivers: false,
      ignoreSwipe: false,
      isCasting: false,
      airplay: {
        available: false,
        connected: false,
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

    this.airplayStatusChangeEvent = new NativeEventEmitter(Airplay);
  }

  componentDidMount = () => {
    Input.addEventListener('ArrowLeft', this.handleOnSwipeLeft);
    Input.addEventListener('ArrowRight', this.handleOnSwipeRight);

    this.airplayStatusChangeEvent.addListener('update', this.handleAirplayStatusChange);
  };

  componentWillUnmount = () => {
    Input.removeEventListener('ArrowLeft', this.handleOnSwipeLeft);
    Input.removeEventListener('ArrowRight', this.handleOnSwipeRight);

    this.airplayStatusChangeEvent.addRemoveListener('update', this.handleAirplayStatusChange);
  };

  handleAirplayStatusChange = event => {
    const { available, connected } = event;

    const { airplay } = this.state;

    if (available) {
      airplay.available = available;
    }

    if (connected) {
      airplay.connected = connected;
    }

    this.setState({ airplay });
  };

  handleOnSwipeRight = () => {
    if (this.state.ignoreSwipe) return;

    this.props.dispatch(nextStream());
  };

  handleOnSwipeLeft = () => {
    if (this.state.ignoreSwipe) return;

    this.props.dispatch(prevStream());
  };

  handleOnTap = () => {
    this.setState({ ignoreSwipe: !this.state.ignoreSwipe });
  };

  handleOnPressGoogleCastControl = () => {
    const { showReceivers } = this.state;
  
    GoogleCast.getAvailableDevices()
      .then(devices => {
        this.setState({ receivers: Object.values(devices), showReceivers: !showReceivers })
      });
  };

  handleOnAirplay = () => {
    Airplay.showAirplayDeviceOptions();
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

  renderAirplayControl = () => {
    if (this.state.airplay.available) {
      return (
        <ACButton source ={AirplayIcon} style={Styles.AirplayIconStyle} onPress={this.handleOnAirplay} />
      );
    }

    return null;
  };

  renderBroadcastControls = () => {
    if (!this.state.isCasting && !this.state.ignoreSwipe) return null;

    return (
      <View style={{ width: '100%', position: 'absolute', flexDirection: 'row', justifyContent: 'flex-end', padding: 10 }}>
        {this.renderGoogleCastReceivers()}
        {this.renderAirplayControl()}
        <ACButton source={GoogleCastIcon} style={Styles.GoogleCastIconStyle} onPress={this.handleOnPressGoogleCastControl} />
      </View>
    );
  };

  renderVideoPlayer = () => {
    const { streamInfo } = this.props;

    return (
      <ACVideo 
        style={{ flex: 1 }}
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
    const { isCasting } = this.state;

    return(
      <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
        <ACScaler
          xRatio={16} 
          yRatio={9}
        >
          {isCasting ? this.renderGoogleCastPlayer() : this.renderVideoPlayer()}
        </ACScaler>
        {this.renderBroadcastControls()}
      </View>
    );
  }
};

const Styles = {
  PickerStyle: {
    margin: FormFactor.isTV ? 15 : 10,
    borderRadius: '5',
    borderColor: '#DEDEDE',
    borderWidth: '1',
    padding: '10',
    backgroundColor: 'black',
    height: '300',
  },
  GoogleCastIconStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: FormFactor.isTV ? 100 : 50,
    height: FormFactor.isTV ? 80 : 40,
  },
  AirplayIconStyle: {
    opacity: PlatformConstants.platform === 'ios' ? 1 : 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: FormFactor.isTV ? 100 : 50,
    height: FormFactor.isTV ? 80 : 40,
  },
};

const mapStateToProps = state => {
  const { streamInfo } = state.stream;

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
