import { DOMParser } from 'xmldom';
import { ProtoAjax } from '../../yo-ad-management.js';

ProtoAjax.DELEGATE = (url, callbacks) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/xml',
    },
  };

  fetch(url, options)
    .then(response => {
      response.text().then(responseText => {
        const responseXML = new DOMParser().parseFromString(responseText);

        const payload = {
          transport: {
            responseURL: url,
            status: response.status,
          },
          responseText,
          responseXML: !responseText.includes('#EXTM3U') ? responseXML : null,
        };

        callbacks.onSuccess(payload);
      });
    })
    .catch(error => {
      callbacks.onFailure(error);
    });
};
