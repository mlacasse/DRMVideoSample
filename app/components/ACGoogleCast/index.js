import React, { PureComponent } from 'react';
import { View, NativeModules, NativeEventEmitter } from 'react-native';
import { FormFactor } from '@youi/react-native-youi';
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
  };

  constructor(props) {
    super(props);

    const { source, metadata } = this.props;

    this.state = {
      metadata,
      source,
      duration: 0,
      elapsed: 0,
      isPlaying: false,
      isReady: false,
    };

    this.receiverUpdateEvent = new NativeEventEmitter(GoogleCast);
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.receiver != prevProps.receiver) {
      GoogleCast.disconnect();
      GoogleCast.connect(this.props.receiver);
    }
  };

  componentDidMount = () => {
    this.receiverUpdateEvent.addListener('update', this.handleOnReceiverUpdate);

    GoogleCast.connect(this.props.receiver);
  };

  componentWillUnmount = () => {
    this.receiverUpdateEvent.removeListener('update', this.handleOnReceiverUpdate);

    GoogleCast.disconnect();    
  };

  handleOnReceiverUpdate = ({ elapsed }) => this.setState({ elapsed: elapsed * 1000 });

  handleOnPlayPausePress = () => {
    const { isReady, isPlaying, source, metadata } = this.state;

    if (!isReady) {
      GoogleCast.prepare(source, metadata)
        .then(() => this.setState({ isReady: true, isPlaying: true }))
        .catch(error => console.log('error', error.message));

      return;
    }

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
    const playPauseStyle = isPlaying ? Styles.pauseIconStyle : Styles.playIconStyle;

    const playBackProgress = duration > 0 ? (elapsed / duration) * 100 : 0;

    return (
      <View style={Styles.playerControlsStyle}>
        <ACButton source={playPauseIcon} style={playPauseStyle} onPress={this.handleOnPlayPausePress} />
        <ACProgressBar barWidth={playBackProgress} />
        <ACElapsedTime style={Styles.elapsedStyle} duration={duration} elapsed={elapsed} />
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

export default ACGoogleCast;