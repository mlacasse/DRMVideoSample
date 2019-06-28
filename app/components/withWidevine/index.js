import React, { Component } from 'react';
import { WidevineCustomRequestDrmHandler } from '@youi/react-native-youi';

const withWidevine = WrappedComponent => {
  if (WidevineCustomRequestDrmHandler === null) {
    return WrappedComponent;
  }

  return class WithWidevine extends Component {
    constructor() {
      super();
    }

    componentDidMount() {
      WidevineCustomRequestDrmHandler.addEventListener(
        'DRM_POST_REQUEST_AVAILABLE',
        this.onWidevineDRMPostRequestAvailable.bind(this)
      );
    }

    componentWillUnmount() {
      WidevineCustomRequestDrmHandler.removeEventListener(
        'DRM_POST_REQUEST_AVAILABLE',
        this.onWidevineDRMPostRequestAvailable
      );
    }

    onWidevineDRMPostRequestAvailable = ({ tag, drmRequestUrl, headers, postData }) => {  
      const drmRequestHeaders = { ...headers, 'Content-Type': 'application/octet-stream' };
  
      fetch(drmRequestUrl, { method: 'POST', headers: drmRequestHeaders, body: null })
        .then((response) => {
          if (!response.ok) {
            WidevineCustomRequestDrmHandler.notifyFailure(tag);
          }
          response.json().then((body) => {
            var typedArray = new Uint8Array(body);
            WidevineCustomRequestDrmHandler.notifySuccess(tag, typedArray);
          })
        }).catch((error) => {
          this.setState({ ...this.state, error });
          WidevineCustomRequestDrmHandler.notifyFailure(tag);
        });
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
};

export default withWidevine;