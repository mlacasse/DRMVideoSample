import React, { Component } from 'react';
import { View, Dimensions, NativeModules } from 'react-native';
import { compose } from 'redux';
import { DeviceInfo, Video } from '@youi/react-native-youi';
import { withFairplay, withPassthrough, withWidevine } from './components';

const FairPlayStream = {
  uri: 'https://dtv-latam-abc.akamaized.net/hls/live/2003011-b/dtv/dtv-latam-boomerang/master.m3u8',
  type: 'HLS',
  assetId: 'c0fe1b7d2de4e5b94dc821091e5b2150',
  drmScheme: 'fairplay',
  drmInfo: null
};

const DASHStream = {
  uri: "https://bitmovin-a.akamaihd.net/content/art-of-motion_drm/mpds/11331.mpd",
  type: 'DASH',
  drmScheme: 'widevine_modular_custom_request',
  drmInfo: {
    licenseAcquisitionUrl: "https://widevine-proxy.appspot.com/proxy"
  }
};

class AppComponent extends Component {
  state = {}

  constructor() {
    super();

    this.state = {
      apiKey: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYXBpIiwidWlkIjoiOWQxOWIzZWQtYzA1Zi00ZTBjLWEzMzgtNDE4NzA1MTAwZGEzIiwiYW5vbiI6ZmFsc2UsInBlcm1pc3Npb25zIjpudWxsLCJhcGlLZXkiOiI5ZDE5YjNlZC1jMDVmLTRlMGMtYTMzOC00MTg3MDUxMDBkYTMiLCJleHAiOjE1ODI3NTE4NDEsImlhdCI6MTUxOTY3OTg0MSwiaXNzIjoiT3JiaXMtT0FNLVYxIiwic3ViIjoiOWQxOWIzZWQtYzA1Zi00ZTBjLWEzMzgtNDE4NzA1MTAwZGEzIn0.iLa8Ch4k59Of4UL6mWJwHNeX-YBb4gcfsw46IMmbT9id-n-8Fj3g0Hz9l6d_GIZDz2Hi8OQsB-CFeycQGYBkgQ',
      username: 'tizen-test3@mailinator.com',
      password: 'Test1234!',
      streamInfo: {
        uri: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
        type: 'HLS'
      }
    };

    this.videoPlayer = null;
  }

  componentWillMount() {
    NativeModules.OrientationLock.setRotationMode(0); // Lock Landscape

    if (DeviceInfo.getDeviceModel() === 'Simulator') {
      return;
    }

    switch(DeviceInfo.getSystemName()) {
      case 'iOS':
      case 'tvOS':
        this.setState({ ...this.state, streamInfo: FairPlayStream })
        break;
      case 'android':
        this.setState({ ...this.state, streamInfo: DASHStream })
        break;
    }
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
    const { width, height } = Dimensions.get('window');

    return(
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Video 
          style={{ width, height }}
          ref={ ref => this.videoPlayer = ref }
          source={this.state.streamInfo}
          onErrorOccurred={this.handleOnErrorOccurred}
          onDurationChanged={() => {}}
          onCurrentTimeUpdated={() =>{}}
          onReady={this.handleOnReady}
        />
      </View>
    );
  }
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

export default compose(conditionalDRMHandler())(AppComponent);
