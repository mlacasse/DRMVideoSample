import { DeviceInfo } from '@youi/react-native-youi';

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

const CLEARStream = {
  uri: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
  type: 'HLS'
};

export default (state = CLEARStream, action) => {
  switch(DeviceInfo.getSystemName()) {
    case 'iOS':
    case 'tvOS':
      state = FairPlayStream;
      break;
    case 'android':
      state = DASHStream;
      break;
  }

  if (DeviceInfo.getDeviceModel() === 'Simulator') {
    state = CLEARStream;
  }

  return state;
};
