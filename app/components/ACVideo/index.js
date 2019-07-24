import React, { PureComponent } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { Image, Video } from '@youi/react-native-youi';

import { ACVideoControlBar, ACVideoProgressBar, ACPlayPauseButton } from './subcomponents';

import styles from './subcomponents/styles';

class ACVideo extends PureComponent {
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
      framesPerSecond: 0,
      isError: false,
      isPlaying: false,
      isReady: false,
      isLive: false
    };

    this.videoPlayer = null;
  }

  calculateDurationCompletedInPercentage = () => {
    return (this.state.durationCompleted / this.state.duration) * 100;
  }

  handleOnTimedMetadata = metadata => {
    console.log('============= handleOnTimedMetadata =============');
    console.log(metadata.nativeEvent);
    console.log('============= handleOnTimedMetadata =============');
  }

  handleOnCurrentTimeUpdated = currentTime => {
    const { duration } = this.state;
    const durationLeft = duration - currentTime;

    this.videoPlayer.getStatistics()
      .then((statistics) => {
        this.setState({
          durationLeft,
          durationCompleted: duration - durationLeft,
          framesPerSecond: statistics.framesPerSecond < 0 ? 0 : statistics.framesPerSecond
        });
      });
  };

  handleOnDurationChanged = duration => {
    this.setState({
      duration,
      durationLeft: duration,
      durationCompleted: 0
    });
  }

  handleOnReady = () => {
    if (this.videoPlayer) {
      this.videoPlayer.getStatistics()
        .then((statistics) => {
          this.setState({ isReady: true, isLive: statistics.isLive });
          this.videoPlayer.play();
        });
    }
  }

  handleOnPlaying = () => {
    this.setState({ isPlaying: true });
  }

  handleOnPaused = () => {
    this.setState({ isPlaying: false });
  }

  handleOnErrorOccurred = error => {
    const { errorCode, message } = error.nativeEvent;

    console.log(errorCode + " : " + message);

    if (this.videoPlayer) {
      this.setState({ isError: true, isReady: false, isPlaying: false, isLive: false });
      this.videoPlayer.stop();
    }
  }

  handleOnPlayControlPress = () => {
    if (this.videoPlayer) {
      if (this.state.isPlaying) {
        this.videoPlayer.pause();
      } else {
        this.videoPlayer.play();
      }
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

  renderIsLive() {
    if (this.state.isLive) {
      return <Image source={{ 'uri': 'res://drawable/default/circle-on-now.png' }} style={styles.playBackIcon} />
    }
  }

  render() {
    return(
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Video 
          ref={ ref => this.videoPlayer = ref }
          source={this.props.source}
          onErrorOccurred={this.handleOnErrorOccurred}
          onDurationChanged={this.handleOnDurationChanged}
          onCurrentTimeUpdated={this.handleOnCurrentTimeUpdated}
          onPlaybackComplete={this.handleOnPlaybackComplete}
          onTimedMetadata={this.handleOnTimedMetadata}
          onPlaying={this.handleOnPlaying}
          onPaused={this.handleOnPaused}
          onReady={this.handleOnReady}
          {...this.props}
        />
        <ACVideoControlBar isLive={this.state.isLive} durationLeft={this.state.durationLeft} framesPerSecond={this.state.framesPerSecond}>
          {this.renderIsLive()}
          <ACPlayPauseButton isPlaying={this.state.isPlaying} onPlayControlPress={this.handleOnPlayControlPress} />
          <ACVideoProgressBar barWidth={this.calculateDurationCompletedInPercentage()} />
        </ACVideoControlBar>
      </View>
    );
  }
};

export default ACVideo;