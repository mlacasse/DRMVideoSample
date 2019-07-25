import React, { PureComponent } from 'react';
import { View, NativeModules, NativeEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { DeviceInfo } from '@youi/react-native-youi';
import { ACVideo, ACScaler, withFairplay, withPassthrough, withWidevine } from './components';

const { Dimensions } = NativeModules;

const ID3TagStream = {
  uri: 'http://csm-e.cds1.yospace.com/csm/live/143389657.m3u8?yo.br=false&yo.ac=true',
  type: 'HLS',
};

class AppComponent extends PureComponent {
  constructor(props) {
    super(props);

    const { width, height } = Dimensions.window;

    this.state = {
      isClear: false,
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

    NativeModules.OrientationLock.setRotationMode(6);

    this.dimensionsChangeEvent = new NativeEventEmitter(Dimensions);
  }

  componentWillMount = () => {
    this.dimensionsChangeEvent.addListener('change', this.handleOnOrientationChange);
  }

  componentWillUnmount = () => {
    this.dimensionsChangeEvent.removeListener('change', this.handleOnOrientationChange);
  }

  toggleStreamInfo = () => {
    if (this.state.isClear) {
      this.setState({ streamInfo: this.props.streamInfo, isClear: false })
    } else {
      this.setState({ streamInfo: ID3TagStream, isClear: true })
    }
  }

  handleOnOrientationChange = ({ window }) => {
    this.setState({ window });
  }

  handleOnSwipeRight = () => {
    this.toggleStreamInfo();
  }

  handleOnSwipeLeft = () => {
    this.toggleStreamInfo();
  }

  render() {
    const { width, height } = this.state.window;

    return(
      <View style={{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'grey',
      }}>
        <ACScaler
          xRatio={16}
          yRatio={9}
          screenDimensions={{ width, height }}
        >
          <ACVideo 
            source={this.state.streamInfo}
            continuous={1}
            onSwipeLeft={this.handleOnSwipeLeft}
            onSwipeRight={this.handleOnSwipeRight}
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
