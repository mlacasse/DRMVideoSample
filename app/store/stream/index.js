import { DeviceInfo } from '@youi/react-native-youi';

const DASHWidevineStream1 = {
  uri: 'https://bitmovin-a.akamaihd.net/content/art-of-motion_drm/mpds/11331.mpd',
  type: 'DASH',
  drmScheme: 'widevine_modular_custom_request',
  drmInfo: {
    licenseAcquisitionUrl: 'https://widevine-proxy.appspot.com/proxy',
  },
};

const DASHWidevineStream2 = {
  uri: 'https://edc-test.cdn.turner.com/DASH_MontereyPop_0011/3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c000014d4/master.mpd',
  type: 'DASH',
  drmScheme: 'widevine_modular_custom_request',
  drmInfo: null,
};

const DASHWidevineStream3 = {
  uri: 'https://profficialsite.origin.mediaservices.windows.net/c51358ea-9a5e-4322-8951-897d640fdfd7/tearsofsteel_4k.ism/manifest(format=mpd-time-csf)',
  type: 'DASH',
  drmScheme: 'widevine_modular_custom_request',
  drmInfo: {
    licenseAcquisitionUrl: 'https://test.playready.microsoft.com/service/rightsmanager.asmx?cfg=(persist:false,sl:150)',
  },
}

const DASHWidevineStream4 = {
  uri: 'https://profficialsite.origin.mediaservices.windows.net/9cc5e871-68ec-42c2-9fc7-fda95521f17d/dayoneplayready.ism/manifest(format=mpd-time-csf)',
  type: 'DASH',
  drmScheme: 'widevine_modular_custom_request',
  drmInfo: {
    licenseAcquisitionUrl: 'https://test.playready.microsoft.com/service/rightsmanager.asmx?cfg=(persist:false,sl:150)',
  },
};

const DASHStream1 = {
  uri: 'https://d2rghg6apqy7xc.cloudfront.net/dvp/test_dash/005/unencrypted/montereypop_16_min_2265099.mpd',
  type: 'DASH',
};

const DASHStream2 = {
  uri: 'http://livesim.dashif.org/livesim/testpic_2s/Manifest.mpd',
  type: 'DASH',
};

const DASHStream3 = {
  uri: 'http://www.bok.net/dash/tears_of_steel/cleartext/stream.mpd',
  type: 'DASH',
};

const DASHStream4 = {
  uri: 'http://b028.wpc.azureedge.net/80B028/Samples/a38e6323-95e9-4f1f-9b38-75eba91704e4/5f2ce531-d508-49fb-8152-647eba422aec.ism/Manifest(format=mpd-time-csf)',
  type: 'DASH',
};

const DASHStream5 = {
  uri: 'http://b028.wpc.azureedge.net/80B028/SampleStream/595d6b9a-d98e-4381-86a3-cb93664479c2/b722b983-af65-4bb3-950a-18dded2b7c9b.ism/Manifest(format=mpd-time-csf)',
  type: 'DASH',
};

const DASHStream6 = {
  uri: 'http://b028.wpc.azureedge.net/80B028/Samples/0e8848ca-1db7-41a3-8867-fe911144c045/d34d8807-5597-47a1-8408-52ec5fc99027.ism/Manifest(format=mpd-time-csf)',
  type: 'DASH',
};

const HLSStream1 = {
  uri: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_16x9/bipbop_16x9_variant.m3u8',
  type: 'HLS',
};

const HLSStream2 = {
  uri: 'https://s3.amazonaws.com/roku-anthony.van.alphen-test/video/portugal-vs-mexico/index.m3u8',
  type: 'HLS',
};

const HLSStream3 = {
  uri: 'http://adultswim-vodlive-qa.cdn.turner.com/live/blackout_testing/smp_blkout_overide-new/new/stream.m3u8',
  type: 'HLS',
};

const HLSStream4 = {
  uri: 'http://adultswim-vodlive-qa.cdn.turner.com/live/blackout_testing/smp_blkout_program-new/new/stream.m3u8',
  type: 'HLS',
};

const HLSStream5 = {
  uri: 'http://adultswim-vodlive-qa.cdn.turner.com/live/blackout_testing/smp_blkout_back2back-new/new/stream.m3u8',
  type: 'HLS',
};

const HLSStream6 = {
  uri: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8',
  type: 'HLS',
};

const HLSStream7 = {
  uri: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
  type: 'HLS',
};

const HLSStream8 = {
  uri: 'http://184.72.239.149/vod/smil:BigBuckBunny.smil/playlist.m3u8',
  type: 'HLS',
};

const HLSStream9 = {
  uri: 'http://playertest.longtailvideo.com/adaptive/oceans_aes/oceans_aes.m3u8',
  type: 'HLS',
};

const HLSStream10 = {
  uri: 'http://www.streambox.fr/playlists/test_001/stream.m3u8',
  type: 'HLS',
};

const HLSStream11 = {
  uri: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_4x3/bipbop_4x3_variant.m3u8',
  type: 'HLS',
};

const HLSStream12 = {
  uri: 'http://iphone-streaming.ustream.tv/uhls/9408562/streams/live/iphone/playlist.m3u8',
  type: 'HLS',
};

const HLSStream13 = {
  uri: 'http://b028.wpc.azureedge.net/80B028/Samples/a38e6323-95e9-4f1f-9b38-75eba91704e4/5f2ce531-d508-49fb-8152-647eba422aec.ism/Manifest(format=m3u8-aapl-v3)',
  type: 'HLS',
};

const HLSStream14 = {
  uri: 'http://b028.wpc.azureedge.net/80B028/SampleStream/595d6b9a-d98e-4381-86a3-cb93664479c2/b722b983-af65-4bb3-950a-18dded2b7c9b.ism/Manifest(format=m3u8-aapl-v3)',
  type: 'HLS',
};

const HLSStream15 = {
  uri: 'http://b028.wpc.azureedge.net/80B028/Samples/0e8848ca-1db7-41a3-8867-fe911144c045/d34d8807-5597-47a1-8408-52ec5fc99027.ism/Manifest(format=m3u8-aapl-v3)',
  type: 'HLS',
};

const HLSStream16 = {
  uri: 'http://vevoplaylist-live.hls.adaptive.level3.net/vevo/ch1/appleman.m3u8',
  type: 'HLS',
};

const FairPlayStream = {
  uri: 'https://dtv-latam-abc.akamaized.net/hls/live/2003011-b/dtv/dtv-latam-boomerang/master.m3u8',
  type: 'HLS',
  assetId: 'c0fe1b7d2de4e5b94dc821091e5b2150',
  drmScheme: 'fairplay',
  drmInfo: null,
};

const DASHStream = {
  uri: 'https://bitmovin-a.akamaihd.net/content/art-of-motion_drm/mpds/11331.mpd',
  type: 'DASH',
  drmScheme: 'widevine_modular_custom_request',
  drmInfo: {
    licenseAcquisitionUrl: 'https://widevine-proxy.appspot.com/proxy'
  },
};

const CLEARStream = {
  uri: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_16x9/bipbop_16x9_variant.m3u8',
  type: 'HLS',
}

export {
  DASHWidevineStream1,
  DASHWidevineStream2,
  DASHWidevineStream3,
  DASHWidevineStream4,
  DASHStream1,
  DASHStream2,
  DASHStream3,
  DASHStream4,
  DASHStream5,
  DASHStream6,
  HLSStream1,
  HLSStream2,
  HLSStream3,
  HLSStream4,
  HLSStream5,
  HLSStream6,
  HLSStream7, 
  HLSStream8,
  HLSStream9,
  HLSStream10,
  HLSStream11,
  HLSStream12,
  HLSStream13,
  HLSStream14,
  HLSStream15,
  HLSStream16,
  DASHStream,
  FairPlayStream,
  CLEARStream,
};

export default (state = CLEARStream, action) => {
  if (DeviceInfo.getDeviceModel() === 'Simulator') {
    return state;
  }

  switch(DeviceInfo.getSystemName()) {
    case 'iOS':
    case 'tvOS':
      state = FairPlayStream;
      break;
    case 'android':
      state = DASHStream;
      break;
  }

  return state;
};
