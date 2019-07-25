import React, { PureComponent } from 'react';
import { View, Text, FormFactor } from '@youi/react-native-youi';
import PropTypes from 'prop-types';

export default class ACElapsedTime extends PureComponent {
  static propTypes = {
    duration: PropTypes.number.isRequired,
    elapsed: PropTypes.number.isRequired,
  };

  createElapsedTimeText = () => {
    const elapsed = {
      seconds: Math.floor((this.props.elapsed / 1000) % 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}),
      minutes: Math.floor((this.props.elapsed / (1000*60)) % 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}),
      hours: Math.floor((this.props.elapsed / (1000*60*60)) % 60),
    }

    if (this.props.duration < 0) {
      return `${elapsed.hours}:${elapsed.minutes}:${elapsed.seconds}`;
    }

    const duration = {
      seconds: Math.floor((this.props.duration / 1000) % 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}),
      minutes: Math.floor((this.props.duration / (1000*60)) % 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}),
      hours: Math.floor((this.props.duration / (1000*60*60)) % 60),
    }

    return `${elapsed.hours}:${elapsed.minutes}:${elapsed.seconds} / ${duration.hours}:${duration.minutes}:${duration.seconds}`;
  }

  render() {
    return (
        <Text style={styles.elapsedStyle}>{this.createElapsedTimeText()}</Text>
    );
  }
}

const styles = {
  elapsedStyle: {
    fontSize: FormFactor.isHandset ? 14 : 25,
    marginLeft: 10,
    marginRight: 10,
    color: '#FAFAFA',
  },
};
