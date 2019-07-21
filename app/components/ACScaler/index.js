import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

class ACScaler extends PureComponent {
  static propTypes = {
    xRatio: PropTypes.number.isRequired, // For video prefer - 16
    yRatio: PropTypes.number.isRequired, // For video prefer - 9
    children: PropTypes.node.isRequired,
    screenDimensions: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
    }).isRequired,
  };

  getScreenDimensions = () => {
    const { xRatio, yRatio } = this.props;
    const screenDimensions = this.props.screenDimensions;
    const screenWidth = screenDimensions.width;
    const screenHeight = screenDimensions.height;

    const isPortrait = screenHeight > screenWidth;

    const decimalRatio = yRatio / xRatio;

    const width = screenWidth;
    const height = isPortrait ? decimalRatio * width : screenHeight;

    return {
      width,
      height,
    };
  };

  render() {
    const containerDimensionStyle = this.getScreenDimensions();
    return <View style={containerDimensionStyle}>{this.props.children}</View>;
  }
}

export default ACScaler;
