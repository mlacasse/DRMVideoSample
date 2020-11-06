import React, { createRef, PureComponent } from 'react';
import { findNodeHandle, View, AppState, BackHandler, NativeModules, NativeEventEmitter } from 'react-native';
import PropTypes from 'prop-types';
import { Video, Input, FormFactor } from '@youi/react-native-youi';
import { debounce } from 'lodash';
import ACButton from '../ACButton';
import ACElapsedTime from '../ACElapsedTime';
import ACProgressBar from '../ACProgressBar';
import ACSwipe from '../ACSwipe';
import ACMetadata from '../ACMetadata';

const PauseIcon = { 'uri': 'res://drawable/default/pause.png' };
const PlayIcon = { 'uri': 'res://drawable/default/play.png' };

const { Airplay, DevicePowerManagementBridge, Interaction } = NativeModules;

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
      selectedClosedCaptionsTrack: -1,
      closedCaptionTracks: [],
    };

    this.airplayStatusUpdateEvent = new NativeEventEmitter(Airplay);
    this.interactionEvent = new NativeEventEmitter(Interaction);

    this.videoPlayer = createRef();
  }

  componentDidMount = () => {
    DevicePowerManagementBridge.keepDeviceScreenOn(true);

    Airplay.setExternalAutoPlayback(findNodeHandle(this.videoPlayer.current), true);

    this.airplayStatusUpdateEvent.addListener('update', this.handleAirplayStatusChange);
    this.interactionEvent.addListener('USER_INTERACTION_TIMEOUT', this.handleUserInteractionTimeout);
    this.interactionEvent.addListener('USER_INTERACTION', this.handleUserInteraction);

    // Set no user interaction timeout for 15 minutes
    Interaction.setInterval(900000);

    Input.addEventListener('Play', this.handleOnPlayPausePress);
    Input.addEventListener('Pause', this.handleOnPlayPausePress);
    Input.addEventListener('MediaPlayPause', this.handleOnPlayPausePress);
    Input.addEventListener('Space', this.handleOnTap);
    Input.addEventListener('SiriRemoteClickCenter', this.handleOnTap);

    BackHandler.addEventListener('hardwareBackPress', this.handleOnTap);
    AppState.addEventListener('change', this.handleAppStateChange);
  };

  componentWillUnmount = () => {
    DevicePowerManagementBridge.keepDeviceScreenOn(false);

    Airplay.setExternalAutoPlayback(findNodeHandle(this.videoPlayer.current), false);

    this.airplayStatusUpdateEvent.removeListener('update', this.handleAirplayStatusChange);
    this.interactionEvent.removeListener('USER_INTERACTION_TIMEOUT', this.handleUserInteractionTimeout);
    this.interactionEvent.removeListener('USER_INTERACTION', this.handleUserInteraction);

    Input.removeEventListener('Play', this.handleOnPlayPausePress);
    Input.removeEventListener('Pause', this.handleOnPlayPausePress);
    Input.removeEventListener('MediaPlayPause', this.handleOnPlayPausePress);
    Input.removeEventListener('Space', this.handleOnTap);
    Input.removeEventListener('SiriRemoteClickCenter', this.handleOnTap);

    BackHandler.removeEventListener('hardwareBackPress', this.handleOnTap);
    AppState.removeEventListener('change', this.handleAppStateChange);
  };

  handleAppStateChange = nextAppState => {
    if (nextAppState === 'active') {
      this.videoPlayer.current.play();
    }
  };

  handleUserInteraction = (event) => {
    // console.log('handleUserInteraction', event);
    DevicePowerManagementBridge.keepDeviceScreenOn(true);
  };

  handleUserInteractionTimeout = () => {
    // User hasn't done anything for a while time to turn the screen saver on.
    DevicePowerManagementBridge.keepDeviceScreenOn(false);
  };

  handleAirplayStatusChange = ({ available, connected }) => {
    if (connected === false && this.state.isPlaying === true) {
      setTimeout(() => this.videoPlayer.current.play(), 500);
    }
  };

  handleOnReady = () => {
    this.videoPlayer.current.getStatistics().then(statistics => {
        const { isLive } = statistics;
        const duration = isLive ? 0 : this.state.duration;

        this.setState({ isLive, duration, elapsed: 0 });

        this.videoPlayer.current.play();
      });
  };

  handleOnCurrentTimeUpdated = currentTime => {
    const { isLive, elapsed } = this.state;

    if (isLive) {
      this.setState({ elapsed: elapsed + 1000 });
    } else {
      this.setState({ elapsed: currentTime });
    }
  };

  handleOnErrorOccurred = error => {
    console.log(error.nativeEvent);

    this.videoPlayer.current.stop();

    this.setState({ isPlaying: false, elapsed: 0, duration: 0 });
  };

  handleOnPlaybackComplete = () => {
    if (this.props.continuous) {

      this.setState({ elapsed: 0 });
  
      this.videoPlayer.current.seek(0);
      this.videoPlayer.current.play();
    } else {
      this.setState({ isPlaying: false });
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
  };

  handleOnTap = event => {
    const { showControls } = this.state;

    if (event !== undefined && event.eventType !== 'up') return;

    if (this.props.onTap) {
      this.props.onTap();
    }

    this.setState({ showControls: !showControls });
  };

  onSeekComplete = (position) => {
    if (position === undefined) return;
    this.videoPlayer.current.seek(Math.floor((position / 100) * this.state.duration));
  };

  onAvailableClosedCaptionsTracksChanged = (closedCaptionTracks) => {
    tempClosedCaptionTracksArray = []
    closedCaptionTracks.nativeEvent.forEach(element => {
      tempClosedCaptionTracksArray.push({
        id: element.id,
        name: element.id == Video.getClosedCaptionsOffId() && element.name == "" ? "OFF" : element.name,
        language: element.language
      })
    });
    this.setState({
      closedCaptionTracks: tempClosedCaptionTracksArray
    })
    // If there are not enough closed captions tracks for the selected track, disable closed captions.
    if(this.state.selectedClosedCaptionsTrack >= closedCaptionTracks.nativeEvent.length)
    {
      this.setState({
        selectedClosedCaptionsTrack: -1
      })
    }
    // If at this point, closed captions are indicated to be disabled with 'selectedClosedCaptionsTrack = -1', set it to the position of the disabled track in the array, for simpler tracking of the selected track position.
    if(this.state.selectedClosedCaptionsTrack < 0)
    {
      this.setState({
        selectedClosedCaptionsTrack: tempClosedCaptionTracksArray.map(track => track.id).indexOf(Video.getClosedCaptionsOffId())
      })
    }};

  renderControls = () => {
    const { title, type } = this.props.source;

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
    const playPauseStyle = isPlaying ? Styles.pauseIconStyle : Styles.playIconStyle;

    const playBackProgress = duration > 0 ? (elapsed / duration) * 100 : 0;

    return (
      <View style={Styles.playerControlsStyle}>
        <ACMetadata style={Styles.playerMetadataTextStyle} title={`${title} - ${type}`} />
        <View style={Styles.playerControlBarStyle}>
          <ACButton source={playPauseIcon} style={playPauseStyle} onPress={this.handleOnPlayPausePress} />
          <ACProgressBar disabled={!this.state.isPlaying || this.state.isLive} barWidth={playBackProgress} onSeekComplete={this.onSeekComplete} />
          <ACElapsedTime style={Styles.elapsedStyle} duration={duration} elapsed={elapsed} />
        </View>
      </View>
    );
  };

  render() {
    const { closedCaptionTracks, selectedClosedCaptionsTrack } = this.state;

    return(
      <View style={{ flex: 1 }}>
        <Video
          ref={this.videoPlayer}
          {...this.props}
          muted={true}
          onCurrentTimeUpdated={this.handleOnCurrentTimeUpdated}
          onPlaybackComplete={this.handleOnPlaybackComplete}
          onDurationChanged={duration => this.setState({ duration, elapsed: 0 })}
          onErrorOccurred={this.handleOnErrorOccurred}
          onPlaying={() => this.setState({ isPlaying: true })}
          onReady={this.handleOnReady}
          selectedClosedCaptionsTrack={Video.getClosedCaptionsTrackId(closedCaptionTracks.map(track => track.id), selectedClosedCaptionsTrack)}
          onAvailableClosedCaptionsTracksChanged={this.onAvailableClosedCaptionsTracksChanged}
        />
        <ACSwipe {...this.props} onTap={this.handleOnTap} />
        {this.renderControls()}
       </View> 
    );
  }
};

const Styles = {
  playIconStyle: {
    width: FormFactor.isTV ? 95 : 34,
    height: FormFactor.isTV ? 110 : 40,
  },
  pauseIconStyle: {
    width: FormFactor.isTV ? 68 : 28,
    height: FormFactor.isTV ? 100 : 38,
  },
  elapsedStyle: {
    fontSize: FormFactor.isTV ? 25 : 18,
    marginLeft: FormFactor.isTV ? 10 : 5,
    color: '#FAFAFA',
  },
  playerControlsStyle: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
    alignItems: 'center',
    position: 'absolute',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    bottom: 0,
    width: '100%',
  },
  playerControlBarStyle: {
    flex: 1, 
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerMetadataTextStyle: {
    fontSize: FormFactor.isTV ? 25 : 18,
    color: '#FAFAFA',
  },
};

export default ACVideo;