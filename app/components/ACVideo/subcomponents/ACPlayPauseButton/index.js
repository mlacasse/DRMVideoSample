import React from 'react';
import PropTypes from 'prop-types';
import { View, Image } from 'react-native';

import ACTouchable from '../../../ACTouchable';

const PlayIcon = 'res://drawable/default/play.png';
const PauseIcon = 'res://drawable/default/pause.png';

import styles from '../styles';

const ACPlayPauseButton = props => {
  const { onPlayControlPress, isPlaying } = props;

  return (
    <ACTouchable style={styles.playPauseStyle} onPress={onPlayControlPress}>
      <Image source={{ 'uri': isPlaying ? PauseIcon : PlayIcon }} style={styles.playBackIcon} />
    </ACTouchable>
  );
};

ACPlayPauseButton.propTypes = {
  isPlaying: PropTypes.bool.isRequired,
  onPlayControlPress: PropTypes.func.isRequired,
};

export default ACPlayPauseButton;
