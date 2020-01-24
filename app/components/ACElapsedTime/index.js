import React, { Fragment, PureComponent } from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';

class ACElapsedTime extends PureComponent {
  static propTypes = {
    elapsed: PropTypes.number.isRequired,
    style: PropTypes.object.isRequired,
    duration: PropTypes.number,
  };

  createElapsedTimeText = () => {
    const elapsed = {
      seconds: Math.floor((this.props.elapsed / 1000) % 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}),
      minutes: Math.floor((this.props.elapsed / (1000*60)) % 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}),
      hours: Math.floor((this.props.elapsed / (1000*60*60)) % 60),
    }

    if (this.props.duration <= 0) {
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
    const { style } = this.props

    return (
      <Fragment>
        <Text style={style}>{this.createElapsedTimeText()}</Text>
      </Fragment>
    );
  }
};

export default ACElapsedTime;