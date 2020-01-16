import React, { createRef, PureComponent } from 'react';
import { View, AppState, BackHandler, NativeModules } from 'react-native';
import PropTypes from 'prop-types';
import { Video, Input } from '@youi/react-native-youi';

import { ACSwipe, ACElapsedTime, ACProgressBar, ACPlayPauseButton, ACClosedCaptionsButton } from './subcomponents';

import { ACVideoStyles } from '../ACVideo/subcomponents/styles';

const { DevicePowerManagementBridge } = NativeModules;

class ACVideo extends PureComponent {
  static propTypes = {
    source: PropTypes.object.isRequired,
    style: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedClosedCaptionsTrack: -1,
      closedCaptionTracks: [],
      duration: 0,
      elapsed: 0,
      showControls: false,
      isPlaying: false,
      isError: false,
      isReady: false,
      isLive: false,
    };

    this.videoPlayer = createRef();
    this.timer = null;
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

    if (this.timer) {
      clearTimeout(this.timer);
    }
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

    this.videoPlayer.current.play();
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

    this.videoPlayer.current.stop();
  }

  handleOnPlaybackComplete = () => {
    if (this.props.continuous) {

      this.setState({ elapsed: 0 });
  
      this.videoPlayer.current.seek(0);
      this.videoPlayer.current.play();
    }

    if (this.props.onPlaybackComplete) {
      this.props.onPlaybackComplete();
    }
  }

  handleOnAvailableClosedCaptionsTracksChanged = availableTracksEvent => {
    const { getClosedCaptionsOffId } = Video;

    const closedCaptionTracks = [];

    availableTracksEvent.nativeEvent.map(({ id, name, language }) => {
      closedCaptionTracks.push({ id, name, language });
    });

    let closedCaptionOffTrack = -1;

    if (closedCaptionTracks.length > 0) {
      closedCaptionOffTrack = closedCaptionTracks.map(track => track.id).indexOf(getClosedCaptionsOffId());
    }

    // Set 'selectedClosedCaptionsTrack' to the position of the disabled track
    // in the array, for simpler tracking of the selected track position.
    this.setState({
      selectedClosedCaptionsTrack: closedCaptionOffTrack,
      closedCaptionOffTrack,
      closedCaptionTracks,
    });
  };

  handleOnMediaPlayPausePress = event => {
    const { keyCode, eventType } = event;

    if (keyCode !== undefined && eventType !== 'up' ) return;

    this.handleOnPlayControlPress();
  }

  handleOnCCControlPress = () => {
    const {
      selectedClosedCaptionsTrack,
      closedCaptionTracks,
      closedCaptionOffTrack,
    } = this.state;

    if (closedCaptionTracks.length > 1 && selectedClosedCaptionsTrack === closedCaptionOffTrack) {
      this.setState({ selectedClosedCaptionsTrack: closedCaptionTracks.map(track => track.language).indexOf('en') });
    } else {
      this.setState({ selectedClosedCaptionsTrack: closedCaptionOffTrack });
    }
  };

  handleOnPlayControlPress = () => {
    if (this.state.isPlaying) {
      this.videoPlayer.current.pause();
    } else {
      this.videoPlayer.current.play();
    }

    this.setState({ isPlaying: !this.state.isPlaying });
  }

  handleOnSelect = event => {
    const { showControls } = this.state;
    const { keyCode, eventType } = event;

    if (keyCode !== undefined && eventType !== 'up' ) return;

    if (!showControls) {
      this.handleOnTap();
    }
  }

  handleOnBack = () => {
    this.setState({ showControls: false });
  };

  handleOnTap = () => {
    const { showControls } = this.state;

    if (this.props.onTap) {
      this.props.onTap();
    }

    this.setState({ showControls: !showControls });
  }

  renderControls = () => {
    const { closedCaptionTracks, showControls } = this.state;

    if (!showControls) {
      return null;
    }

    return (
      <View style={ACVideoStyles.playerControlsStyle}>
        <ACPlayPauseButton isPlaying={this.state.isPlaying} onPlayControlPress={this.handleOnPlayControlPress} />
        <ACProgressBar barWidth={this.calculateProgress()}/>
        <ACClosedCaptionsButton hasClosedCaptions={closedCaptionTracks.length > 1} onCCControlPress={this.handleOnCCControlPress} />
        <ACElapsedTime duration={this.state.duration} elapsed={this.state.elapsed}/>
      </View>
    );
  }

  render = () => {
    const { width, height } = this.props.style;

    const { getClosedCaptionsTrackId, getAudioTrackId } = Video;

    const { selectedClosedCaptionsTrack, closedCaptionTracks, selectedAudioTrack, audioTracks } = this.state;

    return(
      <View style={{ flex: 1 }}>
        <Video 
          ref={this.videoPlayer}
          {...this.props}
          selectedClosedCaptionsTrack={getClosedCaptionsTrackId(closedCaptionTracks.map(track => track.id), selectedClosedCaptionsTrack)}
          onAvailableClosedCaptionsTracksChanged={this.handleOnAvailableClosedCaptionsTracksChanged}
          handleOnAvailableAudioTracksChanged={this.handleOnAvailableAudioTracksChanged}
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