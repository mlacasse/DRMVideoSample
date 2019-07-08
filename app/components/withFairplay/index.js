import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { FairPlayDrmHandler } from '@youi/react-native-youi';

import {
  fairplayDRMRequestUrlAvailable,
  fairplaySPCMessageAvailable,
} from './redux/withFairplayActions';

const withFairplay = WrappedComponent => {
  // module will be equal to `null` on emulated iOS/tvOS devices and OSX
  if (FairPlayDrmHandler === null) {
    return WrappedComponent;
  }

  return class WithFairplay extends Component {
    static propTypes = {
      fairplayDRMRequestUrlAvailable: PropTypes.func.isRequired,
      fairplaySPCMessageAvailable: PropTypes.func.isRequired,
    };

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
      this.props.fairplayDRMRequestUrlAvailable(FairPlayDrmHandler, { drmRequestUrl, tag });
    }

    onFairplaySPCMessageAvailable({ spcMessage, tag }) {
      this.props.fairplaySPCMessageAvailable(FairPlayDrmHandler, { spcMessage, tag });
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
};

const mapDispatchToProps = {
  fairplayDRMRequestUrlAvailable,
  fairplaySPCMessageAvailable,
};

export default compose(
  connect(
    null,
    mapDispatchToProps
  ),
  withFairplay
);