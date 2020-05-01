import { NEXT, PREV } from './types';
import { DeviceInfo } from '@youi/react-native-youi';

const androidStreams = [
  {
    uri:  'https://xandrssads-sponsored.akamaized.net/xaaf_csads/A060770441F0.mp4',
    type: 'MP4',
  },
  {
    uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    type: 'MP4',
  },
  {
    uri: 'https://d2rghg6apqy7xc.cloudfront.net/dvp/test_dash/005/unencrypted/montereypop_16_min_2265099.mpd',
    type: 'DASH',
  },
  {
    uri: 'https://akamai-axtest.akamaized.net/routes/lapd-v1-acceptance/www_c4/Manifest.mpd',
    type: 'DASH',
  },
  {
    uri: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_16x9/bipbop_16x9_variant.m3u8',
    type: 'HLS',
    cast: {
      title: 'Bip-Bop [16x9]',
      description: 'Bip-Bop sample video with captions',
      image: {
        uri: 'http://storage.googleapis.com/android-tv/images/bipbop.png',
        width: 640,
        height: 360,
      },
    },
  },
  {
    uri: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    type: 'HLS',
  },
  {
    uri: 'https://bitmovin-a.akamaihd.net/content/art-of-motion_drm/mpds/11331.mpd',
    type: 'DASH',
    drmScheme: 'widevine_modular_custom_request',
    drmInfo: {
      licenseAcquisitionUrl: 'https://widevine-proxy.appspot.com/proxy',
    },
  },
];

const appleStreams = [
  {
    uri: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_16x9/bipbop_16x9_variant.m3u8',
    type: 'HLS',
    cast: {
      title: 'Bip-Bop [16x9]',
      description: 'Bip-Bop sample video with captions',
      image: {
        uri: 'http://storage.googleapis.com/android-tv/images/bipbop.png',
        width: 640,
        height: 360,
      },
    },
  },
  {
    uri: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8',
    type: 'HLS',
  },
  {
    uri: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    type: 'HLS',
  },
  {
    uri: 'http://playertest.longtailvideo.com/adaptive/oceans_aes/oceans_aes.m3u8',
    type: 'HLS',
  },
  {
    uri: 'https://dtv-latam-abc.akamaized.net/hls/live/2003011-b/dtv/dtv-latam-boomerang/master.m3u8',
    type: 'HLS',
    assetId: 'c0fe1b7d2de4e5b94dc821091e5b2150',
    drmScheme: 'fairplay',
    drmInfo: null,
  },
];

const INITIAL_STATE = {
  index: 0,
  streams: [
    {
      uri: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_16x9/bipbop_16x9_variant.m3u8',
      type: 'HLS',
    },
  ],
  streamInfo: {
    uri: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_16x9/bipbop_16x9_variant.m3u8',
    type: 'HLS',
  },
};

export default (state = INITIAL_STATE, action) => {
  const { type } = action;

  if (type === NEXT) {
    state.index++;

    if (state.index >= state.streams.length) {
      state.index = 0;
    }

    return { ...state, streamInfo: state.streams[state.index] };
  } else if (type === PREV) {
    state.index--;

    if (state.index < 0) {
      state.index = state.streams.length - 1;
    }

    return { ...state, streamInfo: state.streams[state.index] };
  }

  switch(DeviceInfo.getSystemName()) {
    case 'iOS':
    case 'tvOS':
      return { ...state, streams: appleStreams, streamInfo: appleStreams[state.index] };
    case 'android':
      return { ...state, streams: androidStreams, streamInfo: androidStreams[state.index] };
    default:
      return INITIAL_STATE;
  }
};
