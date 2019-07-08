import React, { Component } from 'react';
import { View, NativeModules } from 'react-native';
import PropTypes from 'prop-types';
import { Video } from '@youi/react-native-youi';

import { ACVideoControlBar, ACVideoProgressBar } from './subcomponents';

class ACVideo extends Component {
  static propTypes = {
    source: PropTypes.object.isRequired,
    style: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      duration: 0,
      durationLeft: 0,
      durationCompleted: 0,
      isError: false,
      isPlaying: false,
      isReady: false,
    };

    this.videoPlayer = null;
  }

  componentWillMount() {
    NativeModules.OrientationLock.setRotationMode(0); // Lock Landscape
  }

  calculateDurationCompletedInPercentage = () => {
    return (this.state.durationCompleted / this.state.duration) * 100;
  }

  handleOnCurrentTimeUpdated = currentTime => {
    const { duration } = this.state;
    const durationLeft = duration - currentTime;

    this.setState({
      durationLeft,
      durationCompleted: duration - durationLeft,
    });
  };

  handleOnDurationChanged = duration => {
    this.setState({
      duration,
      durationLeft: duration,
      durationCompleted: 0,
    });
  }

  handleOnReady = () => {
    if (this.videoPlayer) {
      this.setState({ isReady: true });
      this.videoPlayer.play();
    }
  }

  handleOnPlaying = () => {
    this.setState({ isPlaying: true });
  }

  handleOnPause = () => {
    this.setState({ isPlaying: false });
  }

  handleOnErrorOccurred = error => {
    console.log("onErrorOccurred: ", error);

    if (this.videoPlayer) {
      this.setState({ isError: true, isReady: false, isPlaying: false });
      this.videoPlayer.stop();
    }
  }

  handleOnPlaybackComplete = () => {
    if (this.videoPlayer) {
      if (this.props.continuous) {
        this.setState({
          durationLeft: this.state.duration,
          durationCompleted: 0
        });
  
        this.videoPlayer.seek(0);
        this.videoPlayer.play();
      }
    }
  }

  render() {
    return(
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Video 
          ref={ ref => this.videoPlayer = ref }
          source={this.props.streamInfo}
          onErrorOccurred={this.handleOnErrorOccurred}
          onDurationChanged={this.handleOnDurationChanged}
          onCurrentTimeUpdated={this.handleOnCurrentTimeUpdated}
          onPlaybackComplete={this.handleOnPlaybackComplete}
          onPlaying={this.handleOnPlaying}
          onPause={this.handleOnPause}
          onReady={this.handleOnReady}
          {...this.props}
        />
        <ACVideoControlBar durationLeft={this.state.durationLeft}>
          <ACVideoProgressBar barWidth={this.calculateDurationCompletedInPercentage()} />
        </ACVideoControlBar>
      </View>
    );
  }
};

export default ACVideo;