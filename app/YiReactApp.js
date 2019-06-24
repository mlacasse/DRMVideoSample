/**
 * Sample app to demonstrate using a custom video module that uses a custom player integration.
 * The implementation is as follows:
 *  (1) Create a Custom Player to bypass using the the native abstract player for iOS (App.cpp)
 *  (2) Implement platform specific players for iOS (CustomVideoPlayer.cpp)
 *  (3) Demonstrate how to communicate with Custom Player with functionality outside of CYIAbstractVideoPlayer
 * @flow
 */

import React, { Component } from 'react';
import { View } from 'react-native';
import { DeviceInfo, FairPlayDrmHandler, WidevineCustomRequestDrmHandler, Video } from '@youi/react-native-youi';

class YiReactApp extends Component {
  constructor() {
    super();

    this.streamInfo = getStreamInfo();
    this.videoPlayer = null;
  }

  componentWillMount() {
    if (this.streamInfo.drmScheme === 'fairplay') {
      FairPlayDrmHandler.addEventListener('DRM_REQUEST_URL_AVAILABLE', this.onFairplayDRMRequestUrlAvailable);
      FairPlayDrmHandler.addEventListener('SPC_MESSAGE_AVAILABLE', this.onFairplaySPCMessageAvailable);  
    }
  }

  componentWillUnmount() {
    if (this.streamInfo.drmScheme === 'fairplay') {
      FairPlayDrmHandler.removeEventListener('DRM_REQUEST_URL_AVAILABLE', this.onFairplayDRMRequestUrlAvailable);
      FairPlayDrmHandler.removeEventListener('SPC_MESSAGE_AVAILABLE', this.onFairplaySPCMessageAvailable);
    }
  }

  onFairplayDRMRequestUrlAvailable = (args) => {
  }

  onFairplaySPCMessageAvailable = (args) => {
  }

  onLoginsucceeded = (args) => {
  }

  onTokenSuccess = (args) => {
  }

  handleOnReady = () => {
    if (this.videoPlayer) {
      this.videoPlayer.play();
    }
  }

  handleOnErrorOccurred = error => {
    console.log("onErrorOccurred: ", error);
  }

  render() {
    return(
      <View style={styles.containerStyle}>
        <Video 
          style={styles.videoStyle}
          ref={ ref => this.videoPlayer = ref }
          source={this.streamInfo}
          onErrorOccurred={this.handleOnErrorOccurred}
          onDurationChanged={() => {}}
          onCurrentTimeUpdated={() =>{}}
          onReady={this.handleOnReady}
        />
      </View>
    );
  }
};

const getStreamInfo = () => {
  const clearStreamInfo = {
    uri: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    type: 'HLS'
  };

  if (DeviceInfo.getDeviceModel() === 'Simulator') {
    return clearStreamInfo;
  }

  switch(DeviceInfo.getDeviceManufacturer()) {
    case 'Apple':
      return {
        uri: 'https://dtv-latam-abc.akamaized.net/hls/live/2003011-b/dtv/dtv-latam-boomerang/master.m3u8',
        type: 'HLS',
        drmScheme: 'fairplay',
        drmInfo: null
      };
    case 'Android':
      return {
          uri: 'https://dtv-latam-abc.akamaized.net/hls/live/2003011-b/dtv/dtv-latam-boomerang/master.m3u8',
          type: 'HLS',
          drmScheme: 'widevine',
          drmInfo: null
        };
    default:
      return clearStreamInfo;
  }
}

const styles = {
  containerStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  videoStyle: {
    position: 'absolute',
    width: 1920,
    height: 1080
  }
};

export default YiReactApp;