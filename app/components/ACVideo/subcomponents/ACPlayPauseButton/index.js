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
    const { onPlayControlPress, isPlaying } = this.props;

    const touchableStyle = this.state.focused ? {
      ...ACVideoStyles.playPauseStyle,
      borderColor: 'white',
      borderWidth: 1,
    } : ACVideoStyles.playPauseStyle;

    return (
      <TouchableOpacity style={touchableStyle} onFocus={this.handleOnFocus} onBlur={this.handleOnBlur} onPress={onPlayControlPress}>
        <Image source={{ 'uri': isPlaying ? PauseIcon : PlayIcon }} style={ACVideoStyles.playBackIcon} />
      </TouchableOpacity>
    );
  }
}

export default ACPlayPauseButton;
