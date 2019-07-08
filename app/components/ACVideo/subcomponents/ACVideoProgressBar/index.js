import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import styles from '../styles';

const ACVideoProgressBar = props => {
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

ACVideoProgressBar.propTypes = {
  barWidth: PropTypes.number.isRequired,
};

export default ACVideoProgressBar;
