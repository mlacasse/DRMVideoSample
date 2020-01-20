import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Image, TouchableOpacity } from 'react-native';

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

    const touchableStyle = this.state.focused ? ACVideoStyles.buttonFocusedStyle : ACVideoStyles.buttonStyle;

    const buttonStyle = isPlaying ? ACVideoStyles.pauseIcon : ACVideoStyles.playIcon;

    return (
      <TouchableOpacity onFocus={this.handleOnFocus} onBlur={this.handleOnBlur} onPress={onPlayControlPress}>
        <View style={touchableStyle}>
          <Image source={{ 'uri': isPlaying ? PauseIcon : PlayIcon }} style={buttonStyle} />
        </View>
      </TouchableOpacity>
    );
  }
}

export default ACPlayPauseButton;
