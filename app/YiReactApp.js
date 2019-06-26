/**
 * Sample app to demonstrate using FairPlay or Widevine DRM with AT&T's license workflow.
 * @flow
 */

import React, { Component } from 'react';
import { View } from 'react-native';
import { DeviceInfo, FairPlayDrmHandler, WidevineCustomRequestDrmHandler, Video } from '@youi/react-native-youi';

var base64 = require('base-64');

const apiKey = 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYXBpIiwidWlkIjoiOWQxOWIzZWQtYzA1Zi00ZTBjLWEzMzgtNDE4NzA1MTAwZGEzIiwiYW5vbiI6ZmFsc2UsInBlcm1pc3Npb25zIjpudWxsLCJhcGlLZXkiOiI5ZDE5YjNlZC1jMDVmLTRlMGMtYTMzOC00MTg3MDUxMDBkYTMiLCJleHAiOjE1ODI3NTE4NDEsImlhdCI6MTUxOTY3OTg0MSwiaXNzIjoiT3JiaXMtT0FNLVYxIiwic3ViIjoiOWQxOWIzZWQtYzA1Zi00ZTBjLWEzMzgtNDE4NzA1MTAwZGEzIn0.iLa8Ch4k59Of4UL6mWJwHNeX-YBb4gcfsw46IMmbT9id-n-8Fj3g0Hz9l6d_GIZDz2Hi8OQsB-CFeycQGYBkgQ';
const streamUrl = 'https://dtv-latam-abc.akamaized.net/hls/live/2003011-b/dtv/dtv-latam-boomerang/master.m3u8';
const assetId = 'c0fe1b7d2de4e5b94dc821091e5b2150';
const loginUrl = 'https://platform.stage.dtc.istreamplanet.net/oam/v1/user/tokens';
const username = 'tizen-test3@mailinator.com';
const password = 'Test1234!';

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
    if (this.streamInfo.drmScheme === 'fairplay') {
      FairPlayDrmHandler.addEventListener('DRM_REQUEST_URL_AVAILABLE', this.onFairplayDRMRequestUrlAvailable);
      FairPlayDrmHandler.addEventListener('SPC_MESSAGE_AVAILABLE', this.onFairplaySPCMessageAvailable);
    } else if (this.streamInfo.drmInfo ==='widefine_module') {
      WidevineCustomRequestDrmHandler.addEventListener('DRM_POST_REQUEST_AVAILABLE', this.onWidevineDRMPostRequestAvailable);
    }
  }

  componentWillUnmount() {
    if (this.streamInfo.drmScheme === 'fairplay') {
      FairPlayDrmHandler.removeEventListener('DRM_REQUEST_URL_AVAILABLE', this.onFairplayDRMRequestUrlAvailable);
      FairPlayDrmHandler.removeEventListener('SPC_MESSAGE_AVAILABLE', this.onFairplaySPCMessageAvailable);
    } else if (this.streamInfo.drmInfo ==='widefine_module') {
      WidevineCustomRequestDrmHandler.removeEventListener('DRM_POST_REQUEST_AVAILABLE', this.onWidevineDRMPostRequestAvailable);
    }
  }

  onWidevineDRMPostRequestAvailable = (args) => {
    var xmlhttp = new XMLHttpRequest();

     // Incorrect URL set in source. Correct the license acquisition URL here
    xmlhttp.open("POST", "https://widevine-proxy.appspot.com/proxy", true);

     // Configure the HTTP request to send and receive binary data
    xmlhttp.responseType = "arraybuffer";
    xmlhttp.setRequestHeader("Content-Type", "application/octet-stream");

     // Set custom request headers if they're included
    for (var headerKey in args.headers) {
      if (args.headers.hasOwnProperty(headerKey)) {
        xmlhttp.setRequestHeader(headerKey, args.headers[headerKey]);
      }
    }

     // Set the response callback function
      xmlhttp.onload = function() {
      if (xmlhttp.status === 200) {
        if(xmlhttp.response) {
          var typedArray = new Uint8Array(xmlhttp.response);
          const array = [...typedArray];
          WidevineCustomRequestDrmHandler.notifySuccess(args.tag, array);
        }
      }
      else
      {
        console.error("Unhandled HTTP DRM request result: {status: " + xmlhttp.status + ", response text: " + xmlhttp.responseText + "}");
        WidevineCustomRequestDrmHandler.notifyFailure(args.tag);
      }
    };

     // Send the POST request
    xmlhttp.send(new Uint8Array(args.postData));
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
              FairPlayDrmHandler.requestSPCMessage(tag, body, assetId).bind(this);
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
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': "application/x-www-form-urlencoded",
    };

    const authBody = JSON.stringify({
      'username': username,
      'password': password,
    });

    fetch(loginUrl, { method: 'POST', headers: authHeaders, body: authBody })
      .then((response) => {
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
      'assetID': assetId,
      'playbackUrl': streamUrl
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
        uri: "https://bitmovin-a.akamaihd.net/content/art-of-motion_drm/mpds/11331.mpd",
        type: 'DASH',
          drmScheme: 'widevine_modular',
          drmInfo: {
            licenseAcquisitionUrl: "https://widevine-proxy.appspot.com/proxy"
          }
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