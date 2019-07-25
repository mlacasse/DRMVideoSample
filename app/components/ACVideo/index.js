import React, { PureComponent } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { Video } from '@youi/react-native-youi';

import { ACSwipe, ACElapsedTime, ACProgressBar, ACPlayPauseButton } from './subcomponents';

class ACVideo extends PureComponent {
  static propTypes = {
    source: PropTypes.object.isRequired,
    style: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      duration: 0,
      elapsed: 0,
      showControls: false,
      isPlaying: false,
      isError: false,
      isReady: false,
      isLive: false,
    };

    this.videoPlayer = null;
  }

  calculateProgress = () => {
    const { elapsed, duration } = this.state;
    return duration > 0 ? (elapsed / duration) * 100 : 0;
  }

  handleOnCurrentTimeUpdated = currentTime => {
    this.setState({ elapsed: currentTime });

    if (this.props.onCurrentTimeUpdated) {
      this.props.onCurrentTimeUpdated(this.state.elapsed);
    }
  };

  handleOnDurationChanged = duration => {
    this.setState({ duration, elapsed: 0 });

    if (this.props.onDurationChanged) {
      this.props.onDurationChanged(this.state.duration);
    }
  }

  handleOnReady = () => {
    this.setState({ isReady: true });

    if (this.videoPlayer) {
      this.videoPlayer.play();
    }
  }

  handleOnPlaying = () => {
    this.setState({ isPlaying: true });

    if (this.props.onPlaying) {
      this.props.onPlaying();
    }
  }

  handleOnErrorOccurred = error => {
    this.setState({ isError: true, isReady: false, isPlaying: false });

    if (this.props.onErrorOccurred) {
      this.props.onErrorOccurred(error);
    }

    if (this.videoPlayer) {
      this.videoPlayer.stop();
    }
  }

  handleOnPlaybackComplete = () => {
    if (this.props.continuous) {
      if (this.videoPlayer) {
        this.setState({ elapsed: 0 });
    
        this.videoPlayer.seek(0);
        this.videoPlayer.play();
      }
    }

    if (this.props.onPlaybackComplete) {
      this.props.onPlaybackComplete();
    }
  }

  handleOnPlayControlPress = () => {
    if (this.state.isPlaying) {
      this.videoPlayer.pause();
    } else {
      this.videoPlayer.play();
    }

    this.setState({ isPlaying: !this.state.isPlaying });
  }

  handleOnTap = () => {
    if (this.props.onTap) {
      this.props.onTap();
    }

    this.setState({ showControls: !this.state.showControls });
  }

  renderControls = () => {
    if (!this.state.showControls) {
      return;
    }

    return (
      <View
      style={{
      flex: 1,
      flexDirection: 'row',
      backgroundColor: 'black',
      alignItems: 'center',
      position: 'absolute',
      padding: 5,
      bottom: 0,
    }}>
      <ACPlayPauseButton isPlaying={this.state.isPlaying} onPlayControlPress={this.handleOnPlayControlPress} />
      <ACProgressBar barWidth={this.calculateProgress()}/>
      <ACElapsedTime duration={this.state.duration} elapsed={this.state.elapsed}/>
    </View>
    );
  }

  render = () => {
    const { width, height } = this.props.style;

    return(
      <View style={{ flex: 1 }}>
        <Video 
          ref={ ref => this.videoPlayer = ref }
          source={this.props.source}
          onErrorOccurred={this.hanleOnErrorOccurred}
          onDurationChanged={this.handleOnDurationChanged}
          onCurrentTimeUpdated={this.handleOnCurrentTimeUpdated}
          onPlaybackComplete={this.handleOnPlaybackComplete}
          onTimedMetadata={this.props.onTimedMetadata}
          onPlaying={this.handleOnPlaying}
          onPaused={this.props.onPaused}
          onReady={this.handleOnReady}
          {...this.props}
        />
        <ACSwipe style={{ width, height }}
          onSwipeLeft={this.props.onSwipeLeft}
          onSwipeRight={this.props.onSwipeRight}
          onTap={this.handleOnTap}
        />
        {this.renderControls()}
       </View> 
    );
  }
};

export default ACVideo;