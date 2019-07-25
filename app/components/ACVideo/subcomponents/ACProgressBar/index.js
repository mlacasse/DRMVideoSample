import React from 'react';
import PropTypes from 'prop-types';
import { View, FormFactor } from '@youi/react-native-youi';

const ACProgressBar = props => {
  const { barWidth } = props;
  return (
    <View style={styles.progressBarStyle}>
      <View style={styles.trackStyle}>
        <View
          style={[
            styles.trackFillStyle,
            {
              width: `${barWidth}%`,
            },
          ]}
        />
      </View>
    </View>
  );
};

ACProgressBar.propTypes = {
  barWidth: PropTypes.number.isRequired,
};

const styles = {
  progressBarStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    marginLeft: 10,
    marginRight: 10,
  },
  trackStyle: {
    backgroundColor: '#DEDEDE',
    height: FormFactor.isHandset ? 5 : 10,
    width: '100%'
  },
  trackFillStyle: {
    backgroundColor: 'red',
    height: FormFactor.isHandset ? 5 : 10,
    width: '100%'
  },
};

export default ACProgressBar;
