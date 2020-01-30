import React, { createRef, PureComponent } from 'react';
import { View, AppState, BackHandler, NativeModules } from 'react-native';
import PropTypes from 'prop-types';
import { Video, Input, FormFactor } from '@youi/react-native-youi';
import ACButton from '../ACButton';
import ACElapsedTime from '../ACElapsedTime';
import ACProgressBar from '../ACProgressBar';
import ACSwipe from '../ACSwipe';

const PauseIcon = { 'uri': 'res://drawable/default/pause.png' };
const PlayIcon = { 'uri': 'res://drawable/default/play.png' };

const { DevicePowerManagementBridge } = NativeModules;

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
    };

    this.videoPlayer = createRef();
  }

  componentDidMount = () => {
    DevicePowerManagementBridge.keepDeviceScreenOn(true);

    Input.addEventListener('Play', this.handleOnPlayPausePress);
    Input.addEventListener('Pause', this.handleOnPlayPausePress);
    Input.addEventListener('MediaPlayPause', this.handleOnPlayPausePress);

    BackHandler.addEventListener('hardwareBackPress', this.handleOnTap);
    AppState.addEventListener('change', this.handleAppStateChange);
  };

  componentWillUnmount = () => {
    DevicePowerManagementBridge.keepDeviceScreenOn(false);

    Input.removeEventListener('Play', this.handleOnPlayPausePress);
    Input.removeEventListener('Pause', this.handleOnPlayPausePress);
    Input.removeEventListener('MediaPlayPause', this.handleOnPlayPausePress);

    BackHandler.removeEventListener('hardwareBackPress', this.handleOnTap);
    AppState.removeEventListener('change', this.handleAppStateChange);
  };

  handleAppStateChange = nextAppState => {
    if (nextAppState === 'active') {
      this.videoPlayer.current.play();
    }
  };

  handleOnErrorOccurred = error => {
    console.log(error);

    this.videoPlayer.current.stop();

    this.setState({ isPlaying: false });
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

  handleOnTap = () => {
    const { showControls } = this.state;

    if (this.props.onTap) {
      this.props.onTap();
    }

    this.setState({ showControls: !showControls });
  };

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
    const playPauseStyle = isPlaying ? Styles.pauseIconStyle : Styles.playIconStyle;

    const playBackProgress = duration > 0 ? (elapsed / duration) * 100 : 0;

    return (
      <View style={Styles.playerControlsStyle}>
        <ACButton source={playPauseIcon} style={playPauseStyle} onPress={this.handleOnPlayPausePress} />
        <ACProgressBar barWidth={playBackProgress} />
        <ACElapsedTime style={Styles.elapsedStyle} duration={duration} elapsed={elapsed} />
      </View>
    );
  };

  render() {
    return(
      <View style={{ flex: 1 }}>
        <Video
          ref={this.videoPlayer}
          {...this.props}
          onCurrentTimeUpdated={currentTime => this.setState({ elapsed: currentTime })}
          onPlaybackComplete={this.handleOnPlaybackComplete}
          onDurationChanged={duration => this.setState({ duration, elapsed: 0 })}
          onErrorOccurred={this.handleOnErrorOccurred}
          onPlaying={() => this.setState({ isPlaying: true })}
          onReady={() => this.videoPlayer.current.play()}
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
    flexDirection: 'row',
    backgroundColor: 'black',
    alignItems: 'center',
    position: 'absolute',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    bottom: 0,
  },
};

export default ACVideo;