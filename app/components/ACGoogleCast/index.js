import React, { PureComponent } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import ACButton from '../ACButton';
import ACElapsedTime from '../ACElapsedTime';
import ACProgressBar from '../ACProgressBar';

const GoogleCastIcon = { 'uri': 'res://drawable/default/chromecast.png' };
const PauseIcon = { 'uri': 'res://drawable/default/pause.png' };
const PlayIcon = { 'uri': 'res://drawable/default/play.png' };

class ACGoogleCast extends PureComponent {
  static propTypes = {
    source: PropTypes.object.isRequired,
    style: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      duration: 0,
      elapsed: 0,
      isCasting: false,
      isPlaying: false,
    };
  }

  handleOnPlayPausePress = () => {

  };

  handleOnGoogleCastPress = () => {

  };

  render() {
    const {
      isPlaying,
      duration,
      elapsed
    } = this.state;

    const playPauseIcon = isPlaying ? PauseIcon : PlayIcon;
    const playPauseStyle = isPlaying ? ACVideoStyles.pauseIcon : ACVideoStyles.playIcon;

    const playBackProgress = duration > 0 ? (elapsed / duration) * 100 : 0;

    return (
      <View style={ACVideoStyles.playerControlsStyle}>
        <ACButton source={playPauseIcon} style={playPauseStyle} onPress={this.handleOnPlayPausePress} />
        <ACProgressBar barWidth={playBackProgress}/>
        <ACButton source={GoogleCastIcon} style={ACVideoStyles.googleCastIcon} onPress={this.handleOnGoogleCastPress} />
        <ACElapsedTime duration={duration} elapsed={elapsed}/>
      </View>
    );
  }
};

export default ACGoogleCast;