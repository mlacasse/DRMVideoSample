import React, { createRef, PureComponent } from 'react';
import { View, BackHandler, NativeModules } from 'react-native';
import PropTypes from 'prop-types';
import { Video, Input } from '@youi/react-native-youi';
import { ACSwipe, ACElapsedTime, ACProgressBar } from './subcomponents';
import ACButton from '../ACButton';

import { ACVideoStyles, GoogleCastIcon, PlayIcon, PauseIcon, CCIcon } from '../ACVideo/subcomponents/styles';

const { DevicePowerManagementBridge, GoogleCast } = NativeModules;

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

    this.receivers = null;
    this.interval = null;
  }

  componentDidMount = () => {
    this.interval = setInterval(() => {
      GoogleCast.getAvailableDevices().then(
        devices => this.receivers = Object.values(devices)
      )}, 5000);

    DevicePowerManagementBridge.keepDeviceScreenOn(true);

    Input.addEventListener('Play', this.handleOnPlayPausePress);
    Input.addEventListener('Pause', this.handleOnPlayPausePress);
    Input.addEventListener('MediaPlayPause', this.handleOnPlayPausePress);

    BackHandler.addEventListener('hardwareBackPress', this.handleOnTap);
  }

  componentDidUnmount = () => {
    clearInterval(this.interval);

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

  handleOnClosedCaptionPress = () => {
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

  handleOnGoogleCastPress = event => {
    const { keyCode, eventType } = event;

    if (keyCode !== undefined && eventType !== 'up' ) return;

    console.log('GoogleCast', this.receivers);
  };

  handleOnTap = () => {
    const { showControls } = this.state;

    if (this.props.onTap) {
      this.props.onTap();
    }

    this.setState({ showControls: !showControls });
  }

  renderClosedCaptionButton = () => {
    const {closedCaptionTracks } = this.state;

    if (closedCaptionTracks.length > 1) {
      return (
        <ACButton
          source={CCIcon}
          style={ACVideoStyles.ccIcon}
          onPress={this.handleOnClosedCaptionPress}
        />
      );
    }
  }

  renderControls = () => {
    const {
      showControls,
      isPlaying,
      duration,
      elapsed
    } = this.state;

    if (!showControls) {
      return null;
    }

    const playPauseIcon = isPlaying ? PauseIcon : PlayIcon;
    const playPauseStyle = isPlaying ? ACVideoStyles.pauseIcon : ACVideoStyles.playIcon;

    return (
      <View style={ACVideoStyles.playerControlsStyle}>
        <ACButton source={playPauseIcon} style={playPauseStyle} onPress={this.handleOnPlayPausePress} />
        <ACProgressBar barWidth={this.calculateProgress()}/>
        {this.renderClosedCaptionButton()}
        <ACButton source={GoogleCastIcon} style={ACVideoStyles.googleCastIcon} onPress={this.handleOnGoogleCastPress} />
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
        {this.renderControls()}
       </View> 
    );
  }
};

export default ACVideo;