import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Image, TouchableOpacity } from 'react-native';

import { ACVideoStyles } from '../styles';

const PlayIcon = 'res://drawable/default/play.png';
const PauseIcon = 'res://drawable/default/pause.png';

class ACPlayPauseButton extends PureComponent {
  static propTypes = {
    isPlaying: PropTypes.bool.isRequired,
    onPlayControlPress: PropTypes.func.isRequired,
  };

  render() {
    const { onPlayControlPress, isPlaying } = this.props;

    return (
      <TouchableOpacity style={ACVideoStyles.playPauseStyle} onPress={onPlayControlPress}>
        <Image source={{ 'uri': isPlaying ? PauseIcon : PlayIcon }} style={ACVideoStyles.playBackIcon} />
      </TouchableOpacity>
    );
  }
}

export default ACPlayPauseButton;
