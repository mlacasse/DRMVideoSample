import { NEXT, PREV } from './types';
import { DeviceInfo } from '@youi/react-native-youi';

const dashStreams = [
  {
    uri: 'https://bitmovin-a.akamaihd.net/content/art-of-motion_drm/mpds/11331.mpd',
    type: 'DASH',
    drmScheme: 'widevine_modular_custom_request',
    drmInfo: {
      licenseAcquisitionUrl: 'https://widevine-proxy.appspot.com/proxy',
    },
  },
  {
    uri: 'https://edc-test.cdn.turner.com/DASH_MontereyPop_0011/3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c000014d4/master.mpd',
    type: 'DASH',
    drmScheme: 'widevine_modular_custom_request',
    drmInfo: null,
  },
  {
    uri: 'https://profficialsite.origin.mediaservices.windows.net/c51358ea-9a5e-4322-8951-897d640fdfd7/tearsofsteel_4k.ism/manifest(format=mpd-time-csf)',
    type: 'DASH',
    drmScheme: 'widevine_modular_custom_request',
    drmInfo: {
      licenseAcquisitionUrl: 'https://test.playready.microsoft.com/service/rightsmanager.asmx?cfg=(persist:false,sl:150)',
    },
  },
  {
    uri: 'https://profficialsite.origin.mediaservices.windows.net/9cc5e871-68ec-42c2-9fc7-fda95521f17d/dayoneplayready.ism/manifest(format=mpd-time-csf)',
    type: 'DASH',
    drmScheme: 'widevine_modular_custom_request',
    drmInfo: {
      licenseAcquisitionUrl: 'https://test.playready.microsoft.com/service/rightsmanager.asmx?cfg=(persist:false,sl:150)',
    },
  },
  { uri: 'https://d2rghg6apqy7xc.cloudfront.net/dvp/test_dash/005/unencrypted/montereypop_16_min_2265099.mpd', type: 'DASH' },
  { uri: 'http://livesim.dashif.org/livesim/testpic_2s/Manifest.mpd', type: 'DASH' },
  { uri: 'http://www.bok.net/dash/tears_of_steel/cleartext/stream.mpd', type: 'DASH' },
  { uri: 'http://b028.wpc.azureedge.net/80B028/Samples/a38e6323-95e9-4f1f-9b38-75eba91704e4/5f2ce531-d508-49fb-8152-647eba422aec.ism/Manifest(format=mpd-time-csf)', type: 'DASH' },
  { uri: 'http://b028.wpc.azureedge.net/80B028/SampleStream/595d6b9a-d98e-4381-86a3-cb93664479c2/b722b983-af65-4bb3-950a-18dded2b7c9b.ism/Manifest(format=mpd-time-csf)', type: 'DASH' },
  { uri: 'http://b028.wpc.azureedge.net/80B028/Samples/0e8848ca-1db7-41a3-8867-fe911144c045/d34d8807-5597-47a1-8408-52ec5fc99027.ism/Manifest(format=mpd-time-csf)', type: 'DASH' },
];

const hlsStreams = [
  {
    uri: 'https://dtv-latam-abc.akamaized.net/hls/live/2003011-b/dtv/dtv-latam-boomerang/master.m3u8',
    type: 'HLS',
    assetId: 'c0fe1b7d2de4e5b94dc821091e5b2150',
    drmScheme: 'fairplay',
    drmInfo: null,
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
      return { ...state, streams: hlsStreams, streamInfo: hlsStreams[state.index] };
    case 'android':
      return { ...state, streams: dashStreams, streamInfo: hlsStreams[state.index] };
    default:
      return INITIAL_STATE;
  }
};
