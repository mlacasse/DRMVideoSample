import React, { PureComponent } from 'react';
import { View, Dimensions } from 'react-native';

class ACSwipe extends PureComponent {
  constructor(props) {
    super(props);

    const { width } = Dimensions.get('screen');

    this.state = {
      start: undefined,
      width,
    };
  }

  handleOnMoveShouldSetResponder = (evt) => {
    const { width } = this.state;
    const { pageX } = evt.nativeEvent;

    const isFarLeft = pageX < Math.floor(width * 0.25);
    const isFarRight = pageX > Math.floor(width * 0.75);
    const isMiddle = pageX > Math.floor(width * 0.25) && pageX < Math.floor(width * 0.75);

    if (isFarLeft || isFarRight) {
      this.setState({ start: isFarLeft ? 'left' : 'right' });
    } else if (isMiddle) {
      this.setState({ start: 'middle' })
    }

    return this.state.start !== undefined;
  }

  handleOnResponderRelease = (evt) => {
    const { start, width } = this.state;
    const { pageX } = evt.nativeEvent;

    if (start === 'left' && Math.floor(pageX) > width / 2) {
      this.handleOnSwipeRight();
    } else if (start === 'right' && Math.floor(pageX) < width / 2) {
      this.handleOnSwipeLeft();
    } else if (start === 'middle') {
      this.handleOnTap();
    }

    this.setState({ start: undefined });
  }

  handleOnResponderTerminate = (evt) => {
    this.setState({ start: undefined });
  }

  handleOnSwipeRight = () => {
    if (this.props.onSwipeRight) {
      this.props.onSwipeRight();
    }
  }

  handleOnSwipeLeft = () => {
    if (this.props.onSwipeLeft) {
      this.props.onSwipeLeft();
    }
  }

  handleOnTap = () => {
    if (this.props.onTap) {
      this.props.onTap();
    }
  }

  render() {
    return (
      <View
        style={{ ...this.props.style, position: 'absolute' }}
        onMoveShouldSetResponder={this.handleOnMoveShouldSetResponder}
        onResponderRelease={this.handleOnResponderRelease}
        onResponderTerminationRequest={(evt) => true}
        onResponderTerminate={this.handleOnResponderTerminate}
      />
    );
  }
}

export default ACSwipe;