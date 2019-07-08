import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { WidevineCustomRequestDrmHandler } from '@youi/react-native-youi';

import {
  widevineDRMPostRequestAvailable
} from './redux/withWidevineActions';

const withWidevine = WrappedComponent => {
  if (WidevineCustomRequestDrmHandler === null) {
    return WrappedComponent;
  }

  return class WithWidevine extends Component {
    static propTypes = {
      widevineDRMPostRequestAvailable: PropTypes.func.isRequired,
    };


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
      this.props.widevineDRMPostRequestAvailable(WidevineCustomRequestDrmHandler, { tag, drmRequestUrl, headers, postData });
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
};

const mapDispatchToProps = {
  widevineDRMPostRequestAvailable
};

export default compose(
  connect(
    null,
    mapDispatchToProps
  ),
  withWidevine
);
