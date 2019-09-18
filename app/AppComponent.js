import React, { PureComponent } from 'react';
import { View, NativeModules, NativeEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { DeviceInfo, Input } from '@youi/react-native-youi';
import { ACVideo, ACScaler, withFairplay, withPassthrough, withWidevine } from './components';

import { YSSessionManager, YSSessionResult, YSPlayerEvents, ProtoAjax } from '../yo-ad-management.js';

import { DOMParser } from 'xmldom';

import { CLEARStream } from './store/stream';

const { Dimensions, OrientationLock } = NativeModules;

ProtoAjax.DELEGATE = (url, callbacks) => {

  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/xml',
    },
  };
  
  fetch(url, options).then(response => {
    response.text().then(responseText => {
      const responseXML = new DOMParser().parseFromString(responseText);

      const payload = {
        transport: {
          responseURL: url,
          status: response.status,
        },
        responseText,
        responseXML: responseText.indexOf('#EXTM3U') === -1 ? responseXML : null,
      }

      callbacks.onSuccess(payload);
    });
  }).catch(error =>{
    callbacks.onFailure(response);
  });
}

class AppComponent extends PureComponent {
  constructor(props) {
    super(props);

    const { width, height } = Dimensions.window;

    this.state = {
      isClear: false,
      streamInfo: this.props.streamInfo,
      yospaceProps: {
        LOW_FREQ: 4000, // 4 second intervals
        DEBUGGING: true, // verbose logging
        AD_DEBUG: true,  // ad logging
      },
      window: {
        width,  
        height,
      },
    };

    this.yospaceSessionManager = YSSessionManager.createForLive(
      'http://csm-e.cds1.yospace.com/csm/extlive/yospace02,hlssample.m3u8?yo.ac=true&yo.av=2&yo.sl=3&',
      this.state.yospaceProps,
      this.handleYospaceInitialized
    );

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

  handleYospaceInitialized = (state, result) => {
    const { INITIALISED, NOT_INITIALISED, NO_ANALYTICS } = YSSessionResult;

    switch (state) {
      case INITIALISED:
        console.log(`Yospace Stream: ${this.yospaceSessionManager.isYospaceStream() ? 'YES' : 'NO'}`);

        this.yospaceSessionManager.registerPlayer({
          AdBreakStart: () => console.log('AdBreakStart'),
          AdvertStart: (mediaId) => console.log('AdvertStart', mediaId),
          AdvertEnd: (mediaId) => console.log('AdvertEnd', mediaId),
          AdBreakEnd: () => console.log('AdBreakEnd'),
          UpdateTimeline: (timeline) => console.log('UpdateTimeline', timeline),
          AnalyticsFired: (call_id, call_data) => console.log('AnalyticsFired', call_id, call_data),
        });

        this.setState({ streamInfo: { uri: this.yospaceSessionManager.masterPlaylist(), type: 'HLS' }});
        break;
      case NOT_INITIALISED:
        console.log(`Yospace not initialised ${state} ${result}`);
        break;
      case NO_ANALYTICS:
      default:
        console.log(`Yospace no analytics ${state} ${result}`);
        break;
    }

    console.log('Yospace Session Manager', this.yospaceSessionManager);
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
    this.setState({ streamInfo: CLEARStream });
  };

  handleOnSwipeLeft = () => {
    this.setState({ streamInfo: this.props.streamInfo });
  };

  handleOnPlaybackComplete = () => {
    this.yospaceSessionManager.reportPlayerEvent(YSPlayerEvents.END);
  }

  handleOnPlaying = () => {
    this.yospaceSessionManager.reportPlayerEvent(YSPlayerEvents.START);
  }

  render = () => {
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
            getStatistics={this.getStatistics}
            onPlaybackComplete={this.handleOnPlaybackComplete}
            onPlaying={this.handleOnPlaying}
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
