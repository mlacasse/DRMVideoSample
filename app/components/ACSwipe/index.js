import React, { PureComponent } from 'react';
import { View, Dimensions } from 'react-native';

class ACSwipe extends PureComponent {
  constructor(props) {
    super(props);

    const { width } = Dimensions.get('screen');

    this.state = {
      direction: undefined,
      width,
    };
  }

  handleOnMoveShouldSetResponder = (evt) => {
    const { width } = this.state;

    const isFarLeft = evt.nativeEvent.pageX < Math.floor(width * 0.25);
    const isFarRight = evt.nativeEvent.pageX > Math.floor(width * 0.75);

    if (isFarLeft || isFarRight) {
      this.setState({ direction: isFarLeft ? 'left' : 'right' });
    }

    return this.state.direction !== undefined;
  }

  handleOnResponderRelease = (evt) => {
    const { width } = this.state;

    if (this.state.direction === 'left' && Math.floor(evt.nativeEvent.pageX) > width / 2) {
      this.handleOnSwipeRight();
    } else if (this.state.direction === 'right' && Math.floor(evt.nativeEvent.pageX) < width / 2) {
      this.handleOnSwipeLeft();
    }

    this.setState({ direction: undefined });
  }

  handleOnResponderTerminate = (evt) => {
    this.setState({ direction: undefined });
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

  render() {
    return (
      <View
        style={{ position: 'absolute', ...this.props.style }}
        onMoveShouldSetResponder={this.handleOnMoveShouldSetResponder}
        onResponderRelease={this.handleOnResponderRelease}
        onResponderTerminationRequest={(evt) => true}
        onResponderTerminate={this.handleOnResponderTerminate}
      />
    );
  }
}

export default ACSwipe;