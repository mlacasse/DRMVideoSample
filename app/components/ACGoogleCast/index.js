import React, { PureComponent } from 'react';
import { View, NativeModules, NativeEventEmitter } from 'react-native';
import PropTypes from 'prop-types';
import ACButton from '../ACButton';
import ACElapsedTime from '../ACElapsedTime';
import ACProgressBar from '../ACProgressBar';

const PauseIcon = { 'uri': 'res://drawable/default/pause.png' };
const PlayIcon = { 'uri': 'res://drawable/default/play.png' };

const { GoogleCast } = NativeModules;

class ACGoogleCast extends PureComponent {
  static propTypes = {
    source: PropTypes.object.isRequired,
    style: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      duration: 0,
      elapsed: 0,
      isPlaying: false,
    };

    this.mediaInformation = {
      metadata: {
        title: 'Bip-Bop [16x9]',
        description: 'Bip-Bop sample video with captions',
        image: 'http://storage.googleapis.com/android-tv/images/bipbop.png',
        width: '640',
        height: '360',
      },
      source: {
        uri: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_16x9/bipbop_16x9_variant.m3u8',
        type: 'application/x-mpegURL',  
      },
    };

    this.receiver = 'com.google.cast.CastDevice:3cd6f8e9dc13c2c6915ea65f94de15b6';ß

    this.receiverUpdateEvent = new NativeEventEmitter(GoogleCast);
  }

  componentDidMount = () => {
    const { source , metadata } = this.mediaInformation;

    this.receiverUpdateEvent.addListener('update', this.handleOnReceiverUpdate);

    GoogleCast.connect(this.receiver);
    GoogleCast.prepare(source, metadata);

    this.setState({ isPlaying: true });
  };

  componentWillUnmount = () => {
    this.receiverUpdateEvent.removeListener('update', this.handleOnReceiverUpdate);

    GoogleCast.disconnect();    
  };

  handleOnReceiverUpdate = ({ position }) => this.setState({ elapsed: position });

  handleOnPlayPausePress = () => {
    const { isPlaying } = this.state;

    if (isPlaying) {
      GoogleCast.pause();
    } else {
      GoogleCast.play();
    }

    this.setState({ isPlaying: !isPlaying });
  };

  render() {
    const {
      isPlaying,
      duration,
      elapsed
    } = this.state;

    const playPauseIcon = isPlaying ? PauseIcon : PlayIcon;
    const playPauseStyle = isPlaying ? Styles.pauseIcon : Styles.playIcon;

    const playBackProgress = duration > 0 ? (elapsed / duration) * 100 : 0;

    return (
      <View style={Styles.playerControlsStyle}>
        <ACButton source={playPauseIcon} style={playPauseStyle} onPress={this.handleOnPlayPausePress} />
        <ACProgressBar barWidth={playBackProgress}/>
        <ACElapsedTime duration={duration} elapsed={elapsed}/>
      </View>
    );
  }
};

const Styles = {
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

export default ACGoogleCast;