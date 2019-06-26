/**
 * Sample app to demonstrate using FairPlay or Widevine DRM with AT&T's license workflow.
 * @flow
 */

import React, { Component } from 'react';
import { 
  View, 
  Dimensions, 
  NativeModules 
} from 'react-native';
import {
  DeviceInfo, 
  FairPlayDrmHandler, 
  WidevineCustomRequestDrmHandler, 
  Video
} from '@youi/react-native-youi';

var base64 = require('base-64');

class YiReactApp extends Component {
  constructor() {
    super();

    this.fairplayCompanyId = null;
    this.fairplayHostUrl = null;
    this.spcMessage = null;
    this.tag = null;

    this.videoPlayer = null;
    this.streamInfo = getStreamInfo();
  }

  componentWillMount() {
    NativeModules.OrientationLock.setRotationMode(0); // Lock Landscape

    if (this.streamInfo.drmScheme === 'fairplay') {
      FairPlayDrmHandler.addEventListener('DRM_REQUEST_URL_AVAILABLE', this.onFairplayDRMRequestUrlAvailable);
      FairPlayDrmHandler.addEventListener('SPC_MESSAGE_AVAILABLE', this.onFairplaySPCMessageAvailable);
    } else if (this.streamInfo.drmScheme ==='widevine_modular_custom_request') {
      WidevineCustomRequestDrmHandler.addEventListener('DRM_POST_REQUEST_AVAILABLE', this.onWidevineDRMPostRequestAvailable);
    }
  }

  componentWillUnmount() {
    if (this.streamInfo.drmScheme === 'fairplay') {
      FairPlayDrmHandler.removeEventListener('DRM_REQUEST_URL_AVAILABLE', this.onFairplayDRMRequestUrlAvailable);
      FairPlayDrmHandler.removeEventListener('SPC_MESSAGE_AVAILABLE', this.onFairplaySPCMessageAvailable);
    } else if (this.streamInfo.drmScheme ==='widevine_modular_custom_request') {
      WidevineCustomRequestDrmHandler.removeEventListener('DRM_POST_REQUEST_AVAILABLE', this.onWidevineDRMPostRequestAvailable);
    }
  }

  onWidevineDRMPostRequestAvailable = (args) => {
    const { tag, drmRequestUrl, headers, postData } = args;

    const drmRequestHeaders = { ...headers, 'Content-Type': 'application/octet-stream' };

    fetch(drmRequestUrl, { method: 'POST', headers: drmRequestHeaders, body: postData })
      .then((response) => {
        if (!response.ok) {
          console.log("The login request failed: " + response.status);
          WidevineCustomRequestDrmHandler.notifyFailure(tag);
        }
        response.json().then((body) => {
          var typedArray = new Uint8Array(body);
          WidevineCustomRequestDrmHandler.notifySuccess(tag, typedArray);
        })
      }).catch((error) => {
        console.log("An error occured during login: " + error.message);
        WidevineCustomRequestDrmHandler.notifyFailure(tag);
      });
  }

  onFairplayDRMRequestUrlAvailable = (args) => {
    const { tag } = args;

    var urlFormatCorrect = false;

    const splitUrl = args.drmRequestUrl.split("/");
    if (splitUrl.length >= 4) {
      this.fairplayHostUrl = splitUrl[2];
      this.fairplayCompanyId = splitUrl[3];

      const assetId = splitUrl[4];

      if (this.fairplayHostUrl != "" && this.fairplayCompanyId != "" && assetId != "") {
        const fairplayCertUrl = `https://${this.fairplayHostUrl}/api/AppCert/${this.fairplayCompanyId}`;
        fetch(fairplayCertUrl, { method: 'GET', headers: {}, body: null })
          .then((response) => {
            if (!response.ok) {
              console.log("The http request to the fetch certificate URL was not successful (code: " + response.status + ").");
              FairPlayDrmHandler.notifyFailure(tag);
            }
            response.text().then((body) => {
              FairPlayDrmHandler.requestSPCMessage(tag, body, assetId);
            });
          }).catch((error) => {
            console.log("An error occurred while calling the fetch certificate URL: " + error.message);
            FairPlayDrmHandler.notifyFailure(tag);
          });

        urlFormatCorrect = true;
      }
    }

    if (!urlFormatCorrect) {
      console.log("The DRM Request URL was not correctly formatted.");
      FairPlayDrmHandler.notifyFailure(tag);
    }
  }

  onFairplaySPCMessageAvailable = (args) => {
    const { spcMessage, tag } = args;

    const authHeaders = {
      'Authorization': 'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYXBpIiwidWlkIjoiOWQxOWIzZWQtYzA1Zi00ZTBjLWEzMzgtNDE4NzA1MTAwZGEzIiwiYW5vbiI6ZmFsc2UsInBlcm1pc3Npb25zIjpudWxsLCJhcGlLZXkiOiI5ZDE5YjNlZC1jMDVmLTRlMGMtYTMzOC00MTg3MDUxMDBkYTMiLCJleHAiOjE1ODI3NTE4NDEsImlhdCI6MTUxOTY3OTg0MSwiaXNzIjoiT3JiaXMtT0FNLVYxIiwic3ViIjoiOWQxOWIzZWQtYzA1Zi00ZTBjLWEzMzgtNDE4NzA1MTAwZGEzIn0.iLa8Ch4k59Of4UL6mWJwHNeX-YBb4gcfsw46IMmbT9id-n-8Fj3g0Hz9l6d_GIZDz2Hi8OQsB-CFeycQGYBkgQ',
      'Content-Type': "application/x-www-form-urlencoded",
    };

    const authBody = JSON.stringify({
      'username': 'tizen-test3@mailinator.com',
      'password': 'Test1234!',
    });

    fetch('https://platform.stage.dtc.istreamplanet.net/oam/v1/user/tokens',
      {
        method: 'POST',
        headers: authHeaders,
        body: authBody 
      }).then((response) => {
        if (!response.ok) {
          console.log("The login request failed: " + response.status);
          FairPlayDrmHandler.notifyFailure(tag);
        }

        response.json().then((body) => {
          this.onLoginSucceeded(tag, body, spcMessage);
        })
    }).catch((error) => {
      console.log("An error occured during login: " + error.message);
      FairPlayDrmHandler.notifyFailure(tag);
    });
  };

  onLoginSucceeded = (tag, args, spcMessage) => {
    const { sessionToken, account } = args;

    const authHeaders = {
      'Authorization': `Bearer ${sessionToken}`,
      'Content-Type': `application/json`
    };

    const body = JSON.stringify({
      'assetID': this.streamInfo.assetId,
      'playbackUrl': this.streamInfo.uri
    });

    const tokenUrl = `https://platform.stage.dtc.istreamplanet.net/oem/v1/user/accounts/${account.uid}/entitlement?tokentype=isp-atlas`;
    fetch(tokenUrl, { method: 'POST', headers: authHeaders, body: body })
      .then((response) => {
        if (!response.ok) {
          console.log("The token request failed: " + response.status);
          FairPlayDrmHandler.notifyFailure(tag);
        }
        response.json().then((body) => {
          this.onTokenSuccess(tag, body, spcMessage);
        })
      }).catch((error) => {
        console.log("An error occured while requesting the token: " + error.message);
        FairPlayDrmHandler.notifyFailure(tag);
      });
};

onTokenSuccess = (tag, args, spcMessage) => {
  const { entitlementToken } = args;

  const entitlementHeaders = {
    'x-isp-token': entitlementToken
  };

  fetch(`https://${this.fairplayHostUrl}/api/license/${this.fairplayCompanyId}`, {
    method: 'POST',
    headers: entitlementHeaders,
    body: base64.decode(spcMessage)
  }).then((response) => {
    if (!response.ok) {
      console.log("The license request failed: " + response.status);
      FairPlayDrmHandler.notifyFailure(tag);
    }
    response.text().then((body) => {
      FairPlayDrmHandler.provideCKCMessage(tag, body);
    })
  }).catch((error) => {
    console.log("An error occured while fetching the license: " + error.message);
    FairPlayDrmHandler.notifyFailure(tag);
  });
};

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

  switch(DeviceInfo.getSystemName()) {
    case 'iOS':
    case 'tvOS':
      if (DeviceInfo.getDeviceModel() === 'Simulator') {
        return clearStreamInfo;
      }

      return {
        uri: 'https://dtv-latam-abc.akamaized.net/hls/live/2003011-b/dtv/dtv-latam-boomerang/master.m3u8',
        type: 'HLS',
        assetId: 'c0fe1b7d2de4e5b94dc821091e5b2150',
        drmScheme: 'fairplay',
        drmInfo: null
      };
    case 'android':
      return {
        uri: "https://bitmovin-a.akamaihd.net/content/art-of-motion_drm/mpds/11331.mpd",
        type: 'DASH',
          drmScheme: 'widevine_modular_custom_request',
          drmInfo: {
            licenseAcquisitionUrl: "https://widevine-proxy.appspot.com/proxy"
          }
        };
    default:
      return clearStreamInfo;
  }
}

export default YiReactApp;