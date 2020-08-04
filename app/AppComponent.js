import React, { PureComponent } from 'react';
import { View, NativeModules, NativeEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { DeviceInfo, Input } from '@youi/react-native-youi';
import { ACVideo, ACScaler, withFairplay, withPassthrough, withWidevine } from './components';

import { isUnicode, unicode2text } from './utils/unicodeTools';

import { YSSessionManager, YSSessionResult, YSPlayerEvents } from '../yo-ad-management.js';

import { CLEARStream } from './store/stream';

import './utils/xml_delegate';
import './utils/htmlImagePolyfill';

const { Dimensions, OrientationLock } = NativeModules;

class AppComponent extends PureComponent {
  constructor(props) {
    super(props);

    const { width, height } = Dimensions.window;

    this.tag = {};

    this.state = {
      isClear: false,
      streamInfo: this.props.streamInfo,
      yospaceProps: {
        LOW_FREQ: 4000,  // 4 second intervals
        DEBUGGING: true, // verbose logging
        AD_DEBUG: true,  // ad logging
      },
      window: {
        width,  
        height,
      },
    };

    this.yospaceSessionManager = YSSessionManager.createForLive(
      'https://csm-e-dfwprd-eb.tls1.yospace.com/csm/extlive/aegdfwprd01,/Content/HLS.abre/Live/channel(STGCH-26.dfw.1080)/index_mobile.m3u8?yo.up=https://dfwlive-vos-msdc.akamaized.net/Content/HLS_hls-ts.00/Live/channel(COMHD-3035.dfw.1080)/',
      this.state.yospaceProps,
      this.handleYospaceInitialized
    );

     // Necessary to ensure the Image polyfill isn't stripped out when packaged.
    _image = new Image;

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
          AdBreakStart: (YSAdBreak) => { console.log('Yospace Analytics: AdBreakStart', YSAdBreak); },
          AdvertStart: (mediaId) => { console.log('Yospace Analytics: AdvertStart', mediaId); },
          AdvertEnd: (mediaId) => { console.log('Yospace Analytics: AdvertEnd', mediaId); },
          AdBreakEnd: (YSAdBreak) => { console.log('Yospace Analytics: AdBreakEnd', YSAdBreak); },
          UpdateTimeline: (timeline) => { console.log('Yospace Analytics: UpdateTimeline', timeline); },
          AnalyticsFired: (call_id, call_data) => { console.log('Yospace Analytics: AnalyticsFired', call_id, call_data); },
        });

        this.setState({ streamInfo: { uri: this.yospaceSessionManager.masterPlaylist(), type: 'HLS' }});
        break;
      case NOT_INITIALISED:
        console.log(`Yospace not initialised ${state} ${result}`);
      case NO_ANALYTICS:
        console.log(`Yospace no analytics ${state} ${result}`);
      default:
        this.yospaceSessionManager.shutdown();
        this.setState({ streamInfo: this.props.streamInfo });
        break;
    }
  };

  componentDidMount = () => {
    this.dimensionsChangeEvent.addListener('change', this.handleOnOrientationChange);

    Input.addEventListener('ArrowLeft', this.handleOnSwipeLeft);
    Input.addEventListener('ArrowRight', this.handleOnSwipeRight);
  };

  componentWillUnmount = () => {
    if (this.yospaceSessionManager) {
      this.yospaceSessionManager.shutdown();
    }

    this.dimensionsChangeEvent.removeListener('change', this.handleOnOrientationChange);

    Input.removeEventListener('ArrowLeft', this.handleOnSwipeLeft);
    Input.removeEventListener('ArrowRight', this.handleOnSwipeRight);
  };


  handleOnOrientationChange = ({ window })=> {
    this.setState({ window });
  };

  handleOnStateChanged = playerState => {
    console.log(playerState.nativeEvent);
  };

  handleOnTimedMetadata = metadata => {
    console.log('handleOnTimedMetadata', metadata.nativeEvent);
    const { identifier, timestamp, value } = metadata.nativeEvent;

    if (this.yospaceSessionManager) {
      switch(identifier) {
        case 'YMID':
          if (this.tag.YMID && this.tag.YSEQ && this.tag.YCSP && this.tag.YTYP && this.tag.YDUR) {
            this.yospaceSessionManager.reportPlayerEvent(YSPlayerEvents.METADATA, this.tag);
            this.tag = {};
          }      
        case 'YSEQ':
        case 'YCSP':
        case 'YTYP':
        case 'YDUR':
          this.tag[identifier] = isUnicode(value) ? unicode2text(value) : value;
          break;
        default:
          break;
      }
    } else {
      console.log(`Timed Metadata: ${timestamp} ${identifier} ${value}`);
    }
  };

  handleOnCurrentTimeUpdated = currentTime => {
    if (this.yospaceSessionManager) {
      this.yospaceSessionManager.reportPlayerEvent(YSPlayerEvents.POSITION, Math.floor(currentTime / 1000));
    }
  };

  handleOnPlaybackComplete = () => {
    if (this.yospaceSessionManager) {
      this.yospaceSessionManager.reportPlayerEvent(YSPlayerEvents.END);
    }
  };

  handleOnPlaying = () => {
    if (this.yospaceSessionManager) {
      this.yospaceSessionManager.reportPlayerEvent(YSPlayerEvents.FULLSCREEN, true);
      this.yospaceSessionManager.reportPlayerEvent(YSPlayerEvents.START);
    }
  };

  handleOnSwipeRight = () => {
    if (this.yospaceSessionManager) {
      this.yospaceSessionManager.shutdown();
    }

    this.setState({ streamInfo: CLEARStream });
  };

  handleOnSwipeLeft = () => {
    if (this.yospaceSessionManager) {
      this.yospaceSessionManager.shutdown();
    }

    this.setState({ streamInfo: this.props.streamInfo });
  };

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
            continuous={true}
            maxBitrate={400000}
            bufferLength={{
              min: 5000,
              max: 15000,
            }}
            onCurrentTimeUpdated={this.handleOnCurrentTimeUpdated}
            onPlaybackComplete={this.handleOnPlaybackComplete}
            onTimedMetadata={this.handleOnTimedMetadata}
            onStateChanged={this.handleOnStateChanged}
            onSwipeLeft={this.handleOnSwipeLeft}
            onSwipeRight={this.handleOnSwipeRight}
            getStatistics={this.getStatistics}
            onPlaying={this.handleOnPlaying}
          />
        </ACScaler>
      </View>
    );
  }
}

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
