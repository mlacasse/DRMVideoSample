import React, { Component } from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import { FormFactor } from '@youi/react-native-youi';
import PropTypes from 'prop-types';

class ACSwipe extends Component {
  static propTypes = {
    onSwipeRight: PropTypes.func,
    onSwipeLeft: PropTypes.func,
    onTap: PropTypes.func,
    distThreshold: PropTypes.number,
    angleThreshold: PropTypes.number,
    velocityThreshold: PropTypes.number,
  };

  constructor(props) {
    super(props);

    const { distThreshold, angleThreshold, velocityThreshold } = props;

    this.state = {
      start: undefined,
      finished: false,
      x0: undefined,
      y0: undefined,
      distThreshold: distThreshold || 180.0,
      angleThreshold: angleThreshold || 10.0,
      velocityThreshold: velocityThreshold || 300.0,
    };
  }

  handleOnMoveShouldSetResponder = evt => {
    const { pageX, pageY, timestamp } = evt.nativeEvent;

    this.setState({ start: timestamp, x0: pageX, y0: pageY });

    if (this.state.finished) {
      this.setState({ finished: false });
      return false;
    }

    return true;
  };

  handleOnResponderRelease = evt => {
    const { distThreshold, angleThreshold, velocityThreshold } = this.state;
    const horizontalAxisAngle = 180;
    const millisecondsInSecond = 1000;
    const { x0, y0, start } = this.state;
    const { pageX, pageY, timestamp } = evt.nativeEvent;
    const dx = x0 - pageX;
    const dy = y0 - pageY;
    // Resolves the hypotenuse (distance) of the two points
    // TODO divide distance by scale
    const distance = Math.hypot(dx, dy);

    // If the distance is less than the threshold, then ignore the swipe
    if (distance <= distThreshold) {
      this.handleOnTap();

      this.setState({ start: undefined, finished: true });
      return;
    }

    // Determine the angle degree of the swipe (0-360)
    const angleInDegrees = (Math.atan2(dy, dx) * 180) / Math.PI;
    const horizontalAngle = Math.abs(angleInDegrees % horizontalAxisAngle);

    if (
      horizontalAngle > angleThreshold &&
      horizontalAxisAngle - horizontalAngle > angleThreshold // i.e. 177 is only 3 degrees off from 180
    ) {
      this.handleOnTap();

      this.setState({ start: undefined, finished: true });
      return;
    }

    if ((distance / (timestamp - start)) * millisecondsInSecond < velocityThreshold) {
      this.handleOnTap();

      this.setState({ start: undefined, finished: true });
      return;
    }

    if (dx < 0) {
      this.handleOnSwipeRight();
    } else if (dx > 0) {
      this.handleOnSwipeLeft();
    } else {
      this.handleOnTap();
    }

    this.setState({ start: undefined, finished: true });
  };

  handleOnResponderTerminate = () => this.setState({ start: undefined, finished: true });

  handleOnSwipeRight = () => {
    if (this.props.onSwipeRight) {
      this.props.onSwipeRight();
    }
  };

  handleOnSwipeLeft = () => {
    if (this.props.onSwipeLeft) {
      this.props.onSwipeLeft();
    }
  };

  handleOnTap = () => {
    if (this.props.onTap) {
      this.props.onTap();
    }
  }

  render() {
    if (FormFactor.isTV) return null;

    const responderStyle = { ...this.props.style, position: 'absolute' };

    const responderProps = {
      onMoveShouldSetResponder: this.handleOnMoveShouldSetResponder,
      onResponderRelease: this.handleOnResponderRelease,
      onResponderTerminationRequest: evt => true,
      onResponderTerminate: this.handleOnResponderTerminate,
    };

    return (
      <View style={responderStyle} {...responderProps}>
        <TouchableWithoutFeedback onPress={this.handleOnTap}>
          <View style={responderStyle} />
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

export default ACSwipe;