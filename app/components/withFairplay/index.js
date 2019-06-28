import React, { Component } from 'react';
import { FairPlayDrmHandler } from '@youi/react-native-youi';

var base64 = require('base-64');

const withFairplay = WrappedComponent => {
  // module will be equal to `null` on emulated iOS/tvOS devices and OSX
  if (FairPlayDrmHandler === null) {
    return WrappedComponent;
  }

  return class WithFairplay extends Component {
    constructor() {
      super();
    }

    componentDidMount() {
      FairPlayDrmHandler.addEventListener(
        'DRM_REQUEST_URL_AVAILABLE',
        this.onFairplayDRMRequestUrlAvailable.bind(this)
      );

      FairPlayDrmHandler.addEventListener(
        'SPC_MESSAGE_AVAILABLE',
        this.onFairplaySPCMessageAvailable.bind(this)
      );
    }

    componentWillUnmount() {
      FairPlayDrmHandler.removeEventListener(
        'DRM_REQUEST_URL_AVAILABLE',
        this.onFairplayDRMRequestUrlAvailable
      );

      FairPlayDrmHandler.removeEventListener(
        'SPC_MESSAGE_AVAILABLE',
        this.onFairplaySPCMessageAvailable
      );
    }

    onFairplayDRMRequestUrlAvailable({ drmRequestUrl, tag }) {
      const splitUrl = drmRequestUrl.split("/");

      if (splitUrl.length >= 4) {
        const hostUrl = splitUrl[2];
        const companyId = splitUrl[3];
        const assetId = splitUrl[4];
  
        this.setState({ ...this.state, tag, fairplayInfo: { hostUrl, companyId, assetId }});

        if (hostUrl.trim() === '' || companyId.trim() === '' || assetId.trim() === '') {
          FairPlayDrmHandler.notifyFailure(tag);
          return;
        }
  
        fetch(`https://${hostUrl}/api/AppCert/${companyId}`, { method: 'GET', headers: {}, body: null })
          .then((response) => {
            if (!response.ok) {
              FairPlayDrmHandler.notifyFailure(tag);
            }
            response.text().then((license) => {
              FairPlayDrmHandler.requestSPCMessage(tag, license, assetId);
            });
          }).catch((error) => {
            this.setState({ ...this.state, error });
            FairPlayDrmHandler.notifyFailure(tag);
          });
      }
    }

    onFairplaySPCMessageAvailable({ spcMessage, tag }) {
      this.setState({ ...this.state, spcMessage });

      const { apiKey, username, password } = this.state;
  
      const authHeaders = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': "application/x-www-form-urlencoded",
      };
  
      const authBody = JSON.stringify({
        'username': username,
        'password': password,
      });
  
      fetch('https://platform.stage.dtc.istreamplanet.net/oam/v1/user/tokens',
        {
          method: 'POST',
          headers: authHeaders,
          body: authBody 
        }).then((response) => {
          if (!response.ok) {
            FairPlayDrmHandler.notifyFailure(tag);
          }
  
          response.json().then((tokens) => {
            this.handleLoginSuccess(tokens);
          })
      }).catch((error) => {
        this.setState({ ...this.state, error });
        FairPlayDrmHandler.notifyFailure(tag);
      });
    }

    handleLoginSuccess({ sessionToken, account }) {
      const { tag, streamInfo } = this.state;
    
      const authHeaders = {
        'Authorization': `Bearer ${sessionToken}`,
        'Content-Type': `application/json`
      };
    
      const body = JSON.stringify({
        'assetID': streamInfo.assetId,
        'playbackUrl': streamInfo.uri
      });
    
      const tokenUrl = `https://platform.stage.dtc.istreamplanet.net/oem/v1/user/accounts/${account.uid}/entitlement?tokentype=isp-atlas`;
      fetch(tokenUrl, { method: 'POST', headers: authHeaders, body: body })
        .then((response) => {
          if (!response.ok) {
            FairPlayDrmHandler.notifyFailure(tag);
          }
          response.json().then((entitlements) => {
            this.handleTokenSuccess(entitlements);
          })
        }).catch((error) => {
          this.setState({ ...this.state, error });
          FairPlayDrmHandler.notifyFailure(tag);
        });
    }
    
    handleTokenSuccess(entitlements) {
      const { tag, spcMessage, fairplayInfo } = this.state;
    
      const { entitlementToken } = entitlements;
    
      fetch(`https://${fairplayInfo.hostUrl}/api/license/${fairplayInfo.companyId}`, {
        method: 'POST',
        headers: {
          'x-isp-token': entitlementToken
        },
        body: base64.decode(spcMessage)
      }).then((response) => {
        if (!response.ok) {
          FairPlayDrmHandler.notifyFailure(tag);
        }
        response.text().then((result) => {
          FairPlayDrmHandler.provideCKCMessage(tag, result);
        })
      }).catch((error) => {
        this.setState({ ...this.state, error });
        FairPlayDrmHandler.notifyFailure(tag);
      });
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
};

export default withFairplay;