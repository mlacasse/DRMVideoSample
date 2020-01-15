import React from 'react';
import PropTypes from 'prop-types';
import { Image, TouchableOpacity } from 'react-native';

import { ACVideoStyles } from '../styles';

const PlayIcon = 'res://drawable/default/play.png';
const PauseIcon = 'res://drawable/default/pause.png';

const ACPlayPauseButton = props => {
  const { onPlayControlPress, isPlaying } = props;

  return (
    <TouchableOpacity style={ACVideoStyles.playPauseStyle} onPress={onPlayControlPress}>
      <Image source={{ 'uri': isPlaying ? PauseIcon : PlayIcon }} style={ACVideoStyles.playBackIcon} />
    </TouchableOpacity>
  );
};

ACPlayPauseButton.propTypes = {
  isPlaying: PropTypes.bool.isRequired,
  onPlayControlPress: PropTypes.func.isRequired,
};

export default ACPlayPauseButton;
