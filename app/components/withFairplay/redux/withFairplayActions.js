import { setError } from '../../../store/app/actions';
import { setFairplayInfo, setSPCMessage } from '../../../store/drm/actions';

var base64 = require('base-64');

const fairplayDRMRequestUrlAvailable = function(drmHandler, { drmRequestUrl, tag }) {
  return dispatch => {
    const splitUrl = drmRequestUrl.split("/");

    if (splitUrl.length >= 4) {
      const hostUrl = splitUrl[2];
      const companyId = splitUrl[3];
      const assetId = splitUrl[4];

      dispatch(setFairplayInfo({ fairplayInfo: { hostUrl, companyId, assetId }} ));

      if (hostUrl.trim() === '' || companyId.trim() === '' || assetId.trim() === '') {
        drmHandler.notifyFailure(tag);
        return;
      }

      fetch(`https://${hostUrl}/api/AppCert/${companyId}`, { method: 'GET', headers: {}, body: null })
        .then((response) => {
          if (!response.ok) {
            drmHandler.notifyFailure(tag);
          }
          response.text().then((license) => {
            drmHandler.requestSPCMessage(tag, license, assetId);
          });
        }).catch((error) => {
          dispatch(setError(error));
          drmHandler.notifyFailure(tag);
        });
    }
  }
};

const fairplaySPCMessageAvailable = function(drmHandler, { spcMessage, tag }) {
  return function(dispatch, getState) {
    dispatch(setSPCMessage({ tag, spcMessage }));

    const { apiKey, username, password } = getState().app;

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
          drmHandler.notifyFailure(tag);
        }

        response.json().then((tokens) => {
          dispatch(handleLoginSuccess(drmHandler, tag, tokens));
        })
    }).catch((error) => {
      dispatch(setError(error));
      drmHandler.notifyFailure(tag);
    });
  };
};

const handleLoginSuccess = (drmHandler, tag, { sessionToken, account }) => {
  return function(dispatch, getState) {
    const { stream } = getState();

    const authHeaders = {
      'Authorization': `Bearer ${sessionToken}`,
      'Content-Type': `application/json`
    };

    const body = JSON.stringify({
      'assetID': stream.streamInfo.assetId,
      'playbackUrl': stream.streamInfo.uri
    });

    const tokenUrl = `https://platform.stage.dtc.istreamplanet.net/oem/v1/user/accounts/${account.uid}/entitlement?tokentype=isp-atlas`;
    fetch(tokenUrl, { method: 'POST', headers: authHeaders, body: body })
      .then((response) => {
        if (!response.ok) {
          drmHandler.notifyFailure(tag);
        }
        response.json().then((entitlements) => {
          dispatch(handleTokenSuccess(drmHandler, tag, entitlements));
        })
      }).catch((error) => {
        dispatch(setError(error));
        drmHandler.notifyFailure(tag);
      });
  };
};

const handleTokenSuccess = (drmHandler, tag, entitlements) => {
  return function(dispatch, getState) {
    const { spcMessage, fairplayInfo } = getState().drm;
      
    const { entitlementToken } = entitlements;

    fetch(`https://${fairplayInfo.hostUrl}/api/license/${fairplayInfo.companyId}`, {
      method: 'POST',
      headers: {
        'x-isp-token': entitlementToken
      },
      body: base64.decode(spcMessage)
    }).then((response) => {
      if (!response.ok) {
        drmHandler.notifyFailure(tag);
      }
      response.text().then((result) => {
        drmHandler.provideCKCMessage(tag, result);
      })
    }).catch((error) => {
      dispatch(setError(error));
      drmHandler.notifyFailure(tag);
    });
  };
};

export { fairplayDRMRequestUrlAvailable, fairplaySPCMessageAvailable };
