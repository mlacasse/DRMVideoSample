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

self.Image = () => {};

Object.defineProperty(Image.prototype, 'src', {
  get() { return src; },
  set(url) {
    fetch(url).then(response => {
      console.log('Image Polyfill Success!', url, response);
    }).catch(error => {
      console.log('Image Polyfill Failed!', url, error);
    });
    src = url;
  },
  configurable: true
});  

const isUnicode = (raw) => {
  const capture = raw.match(/^<03(.*)>$/);
  if (!capture) return false;

  return capture.length === 2 ? true : false;
}

const unicode2text = (raw) => {
  let ret = '';

  try {
    const capture = raw.replace(/\s/gi,'').match(/^<03(.*)>$/);
    const array = capture[1].match(/.{1,2}/g);
  
    array.forEach(data => {
      ret += String.fromCharCode(parseInt(data, 16));
    });
  } catch(error) {
    console.log('unicode2text', error);
    return '';
  }

  return ret;
};

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
  }).catch(error => {
    console.log('ProtoAjax.DELEGATE', error);
    callbacks.onFailure(response);
  });
}

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
      'http://csm-e.cds1.yospace.com/csm/extlive/yospace02,hlssample.m3u8?yo.ac=true&',
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
        break;
    }
  }

  componentDidMount = () => {
    this.dimensionsChangeEvent.addListener('change', this.handleOnOrientationChange);

    Input.addEventListener('ArrowLeft', this.handleOnSwipeLeft);
    Input.addEventListener('ArrowRight', this.handleOnSwipeRight);
  };

  componentDidUnmount = () => {
    if (this.yospaceSessionManager) {
      this.yospaceSessionManager.shutdown();
    }

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

  handleOnTimedMetadata = (metadata) => {
    const { identifier, timestamp, value } = metadata.nativeEvent;

    if (this.yospaceSessionManager) {
      switch(identifier) {
        case 'YMID':
        case 'YSEQ':
        case 'YCSP':
        case 'YTYP':
        case 'YDUR':
          this.tag[identifier] = isUnicode(value) ? unicode2text(value) : value;
          break;
        default:
          break;
      }

      if (this.tag.YMID && this.tag.YSEQ && this.tag.YCSP && this.tag.YTYP && this.tag.YDUR) {
        this.yospaceSessionManager.reportPlayerEvent(YSPlayerEvents.METADATA, this.tag);
        this.tag = {};
      }
    } else {
      console.log(`Timed Metadata: ${timestamp} ${identifier} ${value}`);
    }
  }

  handleOnCurrentTimeUpdated = (currentTime) => {
    if (this.yospaceSessionManager) {
      this.yospaceSessionManager.reportPlayerEvent(YSPlayerEvents.POSITION, Math.floor(currentTime / 1000));
    }
  }

  handleOnPlaybackComplete = () => {
    if (this.yospaceSessionManager) {
      this.yospaceSessionManager.reportPlayerEvent(YSPlayerEvents.END);
    }
  }

  handleOnPlaying = () => {
    if (this.yospaceSessionManager) {
      this.yospaceSessionManager.reportPlayerEvent(YSPlayerEvents.FULLSCREEN, true);
      this.yospaceSessionManager.reportPlayerEvent(YSPlayerEvents.START);
    }
  }

  handleOnSwipeRight = () => {
    this.setState({ streamInfo: CLEARStream });
  }

  handleOnSwipeLeft = () => {
    this.setState({ streamInfo: this.props.streamInfo });
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
