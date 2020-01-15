import React, { createRef, PureComponent } from 'react';
import { View, AppState, BackHandler, NativeModules } from 'react-native';
import PropTypes from 'prop-types';
import { Video, Input } from '@youi/react-native-youi';

import { ACSwipe, ACElapsedTime, ACProgressBar, ACPlayPauseButton } from './subcomponents';

const { DevicePowerManagementBridge } = NativeModules;

class ACVideo extends PureComponent {
  static propTypes = {
    source: PropTypes.object.isRequired,
    style: PropTypes.object.isRequired,
    continuous: PropTypes.bool,
    onCurrentTimeUpdated: PropTypes.func,
    onPlaybackComplete: PropTypes.func,
    onDurationChanged: PropTypes.func,
    onErrorOccurred: PropTypes.func,
    onPlaying: PropTypes.func,
    onTap: PropTypes.func,
    getStatistics: PropTypes.func,
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

    this.videoPlayer = createRef();
  }

  componentDidMount = () => {
    DevicePowerManagementBridge.keepDeviceScreenOn(true);

    AppState.addEventListener('change', this.handleAppStateChange);

    Input.addEventListener('Select', this.handleOnSelect);
    Input.addEventListener('Play', this.handleOnPlayControlPress);
    Input.addEventListener('Pause', this.handleOnPlayControlPress);
    Input.addEventListener('MediaPlayPause', this.handleOnMediaPlayPausePress);

    BackHandler.addEventListener('hardwareBackPress', this.handleOnTap);
  }

  componentDidUnmount = () => {
    DevicePowerManagementBridge.keepDeviceScreenOn(false);

    AppState.removeEventListener('change', this.handleAppStateChange);

    Input.addRemoveListener('Select', this.handleOnSelect);
    Input.addRemoveListener('Play', this.handleOnPlayControlPress);
    Input.addRemoveListener('Pause', this.handleOnPlayControlPress);
    Input.addRemoveListener('MediaPlayPause', this.handleOnMediaPlayPausePress);

    BackHandler.removeEventListener('hardwareBackPress', this.handleOnTap);
  }

  calculateProgress = () => {
    const { elapsed, duration } = this.state;
    return duration > 0 ? (elapsed / duration) * 100 : 0;
  }

  handleAppStateChange = newAppState => {
    if (newAppState === 'active') {
      if (this.state.isPlaying) {
        this.videoPlayer.current.play();
      }
    }
  }

  handleOnCurrentTimeUpdated = currentTime => {
    this.setState({ elapsed: currentTime });

    if (this.props.onCurrentTimeUpdated) {
      this.props.onCurrentTimeUpdated(this.state.elapsed);
    }

    if (this.props.getStatistics) {
      this.videoPlayer.current.getStatistics().then((statistics) => {
        this.props.getStatistics(statistics);
      });
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
      this.videoPlayer.current.play();
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
      this.videoPlayer.current.stop();
    }
  }

  handleOnPlaybackComplete = () => {
    if (this.props.continuous) {
      if (this.videoPlayer) {
        this.setState({ elapsed: 0 });
    
        this.videoPlayer.current.seek(0);
        this.videoPlayer.current.play();
      }
    }

    if (this.props.onPlaybackComplete) {
      this.props.onPlaybackComplete();
    }
  }

  handleOnMediaPlayPausePress = (event) => {
    const { keyCode, eventType } = event;

    if (keyCode !== undefined && eventType !== 'up' ) return;

    this.handleOnPlayControlPress();
  }

  handleOnPlayControlPress = () => {
    if (this.state.isPlaying) {
      this.videoPlayer.current.pause();
    } else {
      this.videoPlayer.current.play();
    }

    this.setState({ isPlaying: !this.state.isPlaying });
  }

  handleOnSelect = (event) => {
    const { keyCode, eventType } = event;

    if (keyCode !== undefined && eventType !== 'up' ) return;

    this.handleOnTap();
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
          ref={this.videoPlayer}
          {...this.props}
          onCurrentTimeUpdated={this.handleOnCurrentTimeUpdated}
          onPlaybackComplete={this.handleOnPlaybackComplete}
          onDurationChanged={this.handleOnDurationChanged}
          onErrorOccurred={this.handleOnErrorOccurred}
          onPlaying={this.handleOnPlaying}
          onReady={this.handleOnReady}
        />
        <ACSwipe style={{ width, height }}
          {...this.props}
          onTap={this.handleOnTap}
        />
        {this.renderControls()}
       </View> 
    );
  }
};

export default ACVideo;