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

  render() {
    const { onCCControlPress, hasClosedCaptions } = this.props;

    if (!hasClosedCaptions) return null;

    return (
      <TouchableOpacity style={ACVideoStyles.ccStyle} onPress={onCCControlPress}>
        <Image source={{ 'uri': CCIcon }} style={ACVideoStyles.ccIcon} />
      </TouchableOpacity>
    );
  }
}

export default ACCClosedCaptionsButton;
