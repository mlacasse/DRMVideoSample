import React, { PureComponent } from 'react';
import { View, NativeModules, NativeEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { debounce } from "lodash";
import { DeviceInfo, Input, FormFactor } from '@youi/react-native-youi';
import {
  ACButton,
  ACVideo,
  ACGoogleCast,
  ACPicker,
  ACScaler,
  withFairplay,
  withPassthrough,
  withWidevine
} from './components';

import { nextStream, prevStream } from './store/stream/actions';

const GoogleCastIcon = { 'uri': 'res://drawable/default/chromecast.png' };
const AirplayIcon = { 'uri': 'res://drawable/default/airplay.png' };

const { OrientationLock, TrackpadModule, GoogleCast, Airplay, PlatformConstants } = NativeModules;

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
    this.trackpadMoveEvent = new NativeEventEmitter(TrackpadModule);
  }

  componentDidMount = () => {
    Input.addEventListener('ArrowLeft', this.handleOnSwipeLeft);
    Input.addEventListener('ArrowRight', this.handleOnSwipeRight);

    this.airplayStatusChangeEvent.addListener('update', this.handleAirplayStatusChange);
    this.trackpadMoveEvent.addListener('TrackpadMove', this.handleOnMove);
  };

  componentWillUnmount = () => {
    Input.removeEventListener('ArrowLeft', this.handleOnSwipeLeft);
    Input.removeEventListener('ArrowRight', this.handleOnSwipeRight);

    this.airplayStatusChangeEvent.removeListener('update', this.handleAirplayStatusChange);
    this.trackpadMoveEvent.removeListener('TrackpadMove', this.handleOnMove);
  };

  handleOnMove = debounce(evt => {
    if (this.state.showControls || evt.eventName !== 'TrackpadMove') return;

    const { x, y } = evt.translation;

    if (Math.abs(x) > Math.abs(y)) {  // Horizontal transition
      if (Math.abs(x) > 0.25) { // fudge factor - looking for deltas of at least 0.25
        if (x > 0) {
          console.log('handleOnMove', 'right');
          this.handleOnSwipeRight();
        } else {
          console.log('handleOnMove', 'left');
          this.handleOnSwipeLeft();
        }
      }
    } else {  // Vertical transition
      if (Math.abs(y) > 0.25) { // fudge factor - looking for deltas of at least 0.25
        if (y > 0) {
          console.log('handleOnMove', 'up');
        } else {
          console.log('handleOnMove', 'down');
        }
      }
    }
  }, 250);

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

  handleOnSwipeRight = debounce(() => {
    if (this.state.ignoreSwipe) return;

    this.props.dispatch(nextStream());
  }, 250);

  handleOnSwipeLeft = debounce(() => {
    if (this.state.ignoreSwipe) return;

    this.props.dispatch(prevStream());
  }, 250);

  handleOnTap = () => {
    this.setState({ ignoreSwipe: !this.state.ignoreSwipe });
  };

  renderGoogleCastReceivers = () => {
    const { receivers, showReceivers } = this.state;

    if (showReceivers) {
      return (
        <ACPicker
          style={Styles.PickerStyle}
          data={[ localDevice, ...receivers ]}
          onPress={uniqueId => this.setState({
            isCasting: uniqueId ? true : false,
            receiver: uniqueId,
            showReceivers: false,
            ignoreSwipe: uniqueId ? true : false,
          })}
        />
      );
    }
  };

  renderAirplayControl = () => {
    const { airplay, ignoreSwipe } = this.state;

    if (airplay.available && ignoreSwipe) {
      return (
        <ACButton
          source ={AirplayIcon}
          style={Styles.AirplayIconStyle}
          onPress={() => Airplay.showAirplayDeviceOptions()}
        />
      );
    }
  };

  renderGoogleCastControl = () => {
    const { ignoreSwipe, showReceivers } = this.state;

    if (!FormFactor.isTV && ignoreSwipe) {
      return (
        <ACButton
          source={GoogleCastIcon}
          style={Styles.GoogleCastIconStyle}
          onPress={() => 
            GoogleCast.getAvailableDevices()
              .then(devices => {
                this.setState({ receivers: Object.values(devices), showReceivers: !showReceivers })
              })
          }
        />
      );
    }
  };

  renderVideoPlayer = () => {
    const { isCasting, receiver } = this.state;
    const { streamInfo } = this.props;

    if (!isCasting) {
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
    }

    const { uri, type, cast } = streamInfo;

    const source = {
      uri,
      type: type === 'HLS' ? 'application/x-mpegURL' : 'application/dash+xml',
    };

    const { title, description, image } = cast;

    const metadata = {
      title,
      description,
      image: image.uri,
      width: image.width,
      height: image.height,
    };

    return (
      <ACGoogleCast source={source} metadata={metadata} receiver={receiver}/>
    );
  };

  render() {
    return(
      <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
        <ACScaler
          xRatio={16} 
          yRatio={9}
        >
          {this.renderVideoPlayer()}
        </ACScaler>
        <View style={{
          flex: 1,
          flexDirection: 'row',
          position: 'absolute',
          alignSelf: 'flex-end',
          paddingRight: 20,
        }}>
          {this.renderGoogleCastReceivers()}
          {this.renderAirplayControl()}
          {this.renderGoogleCastControl()}
        </View>
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
