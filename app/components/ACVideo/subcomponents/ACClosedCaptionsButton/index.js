import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Image, TouchableOpacity } from 'react-native';

import { ACVideoStyles } from '../styles';

const CCIcon = 'res://drawable/default/cc.png';

class ACCClosedCaptionsButton extends PureComponent {
  static propTypes = {
    hasClosedCaptions: PropTypes.bool.isRequired,
    onCCControlPress: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      focused: false,
    };
  }

  handleOnFocus = () => {
    this.setState({ focused: true });
  }

  handleOnBlur = () => {
    this.setState({ focused: false });
  }

  render() {
    const { onCCControlPress, hasClosedCaptions } = this.props;

    if (!hasClosedCaptions) return null;

    const touchableStyle = this.state.focused ? {
      ...ACVideoStyles.ccStyle,
      borderColor: 'white',
      borderWidth: 1,
    } : ACVideoStyles.ccStyle;

    return (
      <TouchableOpacity style={touchableStyle} onFocus={this.handleOnFocus} onBlur={this.handleOnBlur} onPress={onCCControlPress}>
        <Image source={{ 'uri': CCIcon }} style={ACVideoStyles.ccIcon} />
      </TouchableOpacity>
    );
  }
}

export default ACCClosedCaptionsButton;
