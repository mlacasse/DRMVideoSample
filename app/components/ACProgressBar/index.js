import React from 'react';
import { View } from 'react-native';
import { FormFactor } from '@youi/react-native-youi';
import PropTypes from 'prop-types';

const ACProgressBar = props => {
  const { barWidth } = props;

  if (barWidth === -1) return null;

  return (
    <View style={Styles.progressBarStyle}>
      <View style={Styles.trackStyle}>
        <View style={{ ...Styles.trackFillStyle, width: `${barWidth}%` }} />
      </View>
    </View>
  );
};

const Styles = {
  progressBarStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    marginLeft: FormFactor.isTV ? 15 : 10,
  },
  trackStyle: {
    borderRadius: FormFactor.isTV ? 12 : 6,
    backgroundColor: '#DEDEDE',
    height: FormFactor.isTV ? 40 : 15,
    width: '100%'
  },
  trackFillStyle: {
    borderRadius: FormFactor.isTV ? 12 : 6,
    backgroundColor: 'red',
    height: FormFactor.isTV ? 40 : 15,
    width: '100%'
  },
};

ACProgressBar.propTypes = {
  barWidth: PropTypes.number.isRequired,
};

export default ACProgressBar;
