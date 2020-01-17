import React, { createRef, PureComponent } from 'react';
import { View, BackHandler, NativeModules } from 'react-native';
import PropTypes from 'prop-types';
import { Video, Input, FormFactor } from '@youi/react-native-youi';

import {
  ACSwipe,
  ACElapsedTime,
  ACProgressBar,
  ACPlayPauseButton,
  ACClosedCaptionsButton
} from './subcomponents';

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
    };

    this.videoPlayer = createRef();
  }

  componentDidMount = () => {
    DevicePowerManagementBridge.keepDeviceScreenOn(true);

    Input.addEventListener('Play', this.handleOnPlayPausePress);
    Input.addEventListener('Pause', this.handleOnPlayPausePress);
    Input.addEventListener('MediaPlayPause', this.handleOnPlayPausePress);

    BackHandler.addEventListener('hardwareBackPress', this.handleOnTap);
  }

  componentDidUnmount = () => {
    DevicePowerManagementBridge.keepDeviceScreenOn(false);

    Input.addRemoveListener('Play', this.handleOnPlayPausePress);
    Input.addRemoveListener('Pause', this.handleOnPlayPausePress);
    Input.addRemoveListener('MediaPlayPause', this.handleOnPlayPausePress);

    BackHandler.removeEventListener('hardwareBackPress', this.handleOnTap);
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
    this.setState({ isReady: true, isError: false, isPlaying: false });

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
    } else {
      this.setState({ isPlaying: false });
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

  handleOnCCControlPress = () => {
    const {
      selectedClosedCaptionsTrack,
      closedCaptionTracks,
      closedCaptionOffTrack,
    } = this.state;

    // Set closed captions track to first English language found
    if (closedCaptionTracks.length > 1 && selectedClosedCaptionsTrack === closedCaptionOffTrack) {
      this.setState({ selectedClosedCaptionsTrack: closedCaptionTracks.map(track => track.language).lastIndexOf('en') });
    } else {
      this.setState({ selectedClosedCaptionsTrack: closedCaptionOffTrack });
    }
  };

  handleOnPlayPausePress = event => {
    const { keyCode, eventType } = event;

    if (keyCode !== undefined && eventType !== 'up' ) return;

    const { isPlaying } = this.state;

    if (isPlaying) {
      this.videoPlayer.current.pause();
    } else {
      this.videoPlayer.current.play();
    }

    this.setState({ isPlaying: !isPlaying });
  }

  handleOnTap = () => {
    const { showControls } = this.state;

    if (this.props.onTap) {
      this.props.onTap();
    }

    this.setState({ showControls: !showControls });
  }

  renderTVControls = () => {
    const {
      closedCaptionTracks,
      showControls,
      isPlaying,
      duration,
      elapsed
    } = this.state;

    if (!showControls) {
      return null;
    }

    const { width, height } = this.props.style;

    return (
      <View style={{ width, height, position: 'absolute' }}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <ACPlayPauseButton isPlaying={isPlaying} onPlayControlPress={this.handleOnPlayPausePress} />
          <ACClosedCaptionsButton hasClosedCaptions={closedCaptionTracks.length > 1} onCCControlPress={this.handleOnCCControlPress} />
        </View>
        <View style={ACVideoStyles.playerControlsStyle}>
          <ACProgressBar barWidth={this.calculateProgress()}/>
          <ACElapsedTime duration={duration} elapsed={elapsed}/>
        </View>
      </View>
    );
  };

  renderMobileControls = () => {
    const {
      closedCaptionTracks,
      showControls,
      isPlaying,
      duration,
      elapsed
    } = this.state;

    if (!showControls) {
      return null;
    }

    return (
      <View style={ACVideoStyles.playerControlsStyle}>
        <ACPlayPauseButton isPlaying={isPlaying} onPlayControlPress={this.handleOnPlayPausePress} />
        <ACProgressBar barWidth={this.calculateProgress()}/>
        <ACClosedCaptionsButton hasClosedCaptions={closedCaptionTracks.length > 1} onCCControlPress={this.handleOnCCControlPress} />
        <ACElapsedTime duration={duration} elapsed={elapsed}/>
      </View>
    );
  }

  render = () => {
    const { width, height } = this.props.style;

    const { getClosedCaptionsTrackId } = Video;

    const { selectedClosedCaptionsTrack, closedCaptionTracks } = this.state;

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
        {FormFactor.isTV ? this.renderTVControls() : this.renderMobileControls()}
       </View> 
    );
  }
};

export default ACVideo;