import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import { ACVideoStyles } from '../styles';

const ACProgressBar = props => {
  const { barWidth } = props;

  return (
    <View style={ACVideoStyles.progressBarStyle}>
      <View style={ACVideoStyles.trackStyle}>
        <View style={{ ...ACVideoStyles.trackFillStyle, width: `${barWidth}%` }} />
      </View>
    </View>
  );
};

ACProgressBar.propTypes = {
  barWidth: PropTypes.number.isRequired,
};

export default ACProgressBar;
