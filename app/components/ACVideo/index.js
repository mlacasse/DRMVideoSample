import React, { createRef, PureComponent } from 'react';
import { View, BackHandler, NativeModules } from 'react-native';
import PropTypes from 'prop-types';
import { Video, Input, FormFactor } from '@youi/react-native-youi';
import ACButton from '../ACButton';
import ACElapsedTime from '../ACElapsedTime';
import ACProgressBar from '../ACProgressBar';
import ACSwipe from '../ACSwipe';

const GoogleCastIcon = { 'uri': 'res://drawable/default/chromecast.png' };
const PauseIcon = { 'uri': 'res://drawable/default/pause.png' };
const PlayIcon = { 'uri': 'res://drawable/default/play.png' };

const { DevicePowerManagementBridge, GoogleCast } = NativeModules;

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
      isCasting: false,
      isPlaying: false,
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
  };

  componentDidUnmount = () => {
    clearInterval(this.interval);

    DevicePowerManagementBridge.keepDeviceScreenOn(false);

    Input.addRemoveListener('Play', this.handleOnPlayPausePress);
    Input.addRemoveListener('Pause', this.handleOnPlayPausePress);
    Input.addRemoveListener('MediaPlayPause', this.handleOnPlayPausePress);

    BackHandler.removeEventListener('hardwareBackPress', this.handleOnTap);
  };

  handleOnErrorOccurred = error => {
    this.setState({ isPlaying: false });

    console.log(error);

    this.videoPlayer.current.stop();
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

    const { isPlaying, isCasting } = this.state;

    if (isPlaying) {
      this.videoPlayer.current.pause();

      if (isCasting) {
        GoogleCast.pause();        
      }
    } else {
      this.videoPlayer.current.play();

      if (isCasting) {
        const source = {
          uri: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_16x9/bipbop_16x9_variant.m3u8',
          type: 'application/x-mpegURL',
        };
    
        const metadata = {
          title: 'Bip-Bop [16x9]',
          description: 'Bip-Bop sample video with captions',
          image: 'http://storage.googleapis.com/android-tv/images/bipbop.png',
        };

        GoogleCast.play(source, metadata);        
      }
    }

    this.setState({ isPlaying: !isPlaying });
  };

  handleOnGoogleCastPress = event => {
    const { keyCode, eventType } = event;

    if (keyCode !== undefined && eventType !== 'up' ) return;

    const { isCasting } = this.state;

    if (!isCasting) {
      GoogleCast.connect('com.google.cast.CastDevice:3cd6f8e9dc13c2c6915ea65f94de15b6');
    } else {
      GoogleCast.disconnect();
    }

    this.videoPlayer.current.pause();

    this.setState({ isCasting: !isCasting, isPlaying: false });
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
        <ACProgressBar barWidth={playBackProgress}/>
        <ACButton source={GoogleCastIcon} style={Styles.googleCastIconStyle} onPress={this.handleOnGoogleCastPress} />
        <ACElapsedTime style={Styles.elapsedStyle} duration={duration} elapsed={elapsed}/>
      </View>
    );
  };

  render() {
    const { width, height } = this.props.style;

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
        <ACSwipe style={{ width, height }}
          {...this.props}
          onTap={this.handleOnTap}
        />
        {this.renderControls()}
       </View> 
    );
  }
};

const Styles = {
  googleCastIconStyle: {
    width: FormFactor.isTV ? 187 : 37.5,
    height: FormFactor.isTV ? 180 : 30,
  },
  playIconStyle: {
    width: FormFactor.isTV ? 180 : 34,
    height: FormFactor.isTV ? 180 : 40,
  },
  pauseIconStyle: {
    width: FormFactor.isTV ? 180 : 28,
    height: FormFactor.isTV ? 180 : 38,
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