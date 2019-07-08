import { setError } from '../../../store/app/actions';

const widevineDRMPostRequestAvailable = function(drmHandler, { tag, drmRequestUrl, headers, postData }) {
  return dispatch => {
    const drmRequestHeaders = { ...headers, 'Content-Type': 'application/octet-stream' };

    fetch(drmRequestUrl, { method: 'POST', headers: drmRequestHeaders, body: null })
      .then((response) => {
        if (!response.ok) {
          drmHandler.notifyFailure(tag);
        }
        response.json().then((body) => {
          var typedArray = new Uint8Array(body);
          drmHandler.notifySuccess(tag, typedArray);
        })
      }).catch((error) => {
        dispatch(setError(error));
        drmHandler.notifyFailure(tag);
      });
  }
};

export { widevineDRMPostRequestAvailable };
