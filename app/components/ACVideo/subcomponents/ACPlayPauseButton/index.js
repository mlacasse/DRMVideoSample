import React from 'react';
import PropTypes from 'prop-types';
import { Image, FormFactor } from '@youi/react-native-youi';

import ACTouchable from '../../../ACTouchable';

const PlayIcon = 'res://drawable/default/play.png';
const PauseIcon = 'res://drawable/default/pause.png';

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

const styles = {
  playPauseStyle : {
    marginLeft: 10,
  },
  playBackIcon: {
    width: FormFactor.isHandset ? 20 : 40,
    height: FormFactor.isHandset ? 20 : 40,
  }
};

export default ACPlayPauseButton;
