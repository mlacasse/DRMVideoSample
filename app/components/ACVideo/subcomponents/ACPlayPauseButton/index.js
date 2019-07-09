import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-native';

import ACTouchable from '../../../ACTouchable';
import PlayIcon from './resources/play.png';
import PauseIcon from './resources/pause.png';

import styles from '../styles';

const ACPlayPauseButton = props => {
  const { onPlayControlPress, isPlaying } = props;
  const playPauseIcon = isPlaying ? PauseIcon : PlayIcon;

  return (
    <ACTouchable style={styles.playPauseStyle} onPress={onPlayControlPress}>
      <Image source={playPauseIcon} style={styles.playBackIcon} />
    </ACTouchable>
  );
};

ACPlayPauseButton.propTypes = {
  isPlaying: PropTypes.bool.isRequired,
  onPlayControlPress: PropTypes.func.isRequired,
};

export default ACPlayPauseButton;
