import React, { PureComponent } from 'react';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';

import styles from '../styles';

export default class ACVideoControlBar extends PureComponent {
  static propTypes = {
    durationLeft: PropTypes.number.isRequired,
    framesPerSecond: PropTypes.number.isRequired,
    children: PropTypes.element
  };

  static defaultProps = {
    children: null,
  };

  createDurationText = () => {
    if (this.props.durationLeft <= 0) {
      return `${this.props.framesPerSecond.toFixed(0)}`;
    }

    const seconds = Math.floor((this.props.durationLeft / 1000) % 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
    const minutes = Math.floor((this.props.durationLeft / (1000*60)) % 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
    const hours = Math.floor((this.props.durationLeft / (1000*60*60)) % 60);

    return `${hours}:${minutes}:${seconds}`;
  }

  render() {
    const { children } = this.props;
    
    return (
      <View style={styles.durationContainerStyle}>
        {children}
        <Text style={styles.durationTextStyle}>{this.createDurationText()}</Text>
      </View>
    );
  }
}

