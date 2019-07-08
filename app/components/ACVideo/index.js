import React, { Component } from 'react';
import { View, NativeModules } from 'react-native';
import PropTypes from 'prop-types';
import { Video } from '@youi/react-native-youi';

class ACVideo extends Component {
  static propTypes = {
    source: PropTypes.object.isRequired,
    style: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.videoPlayer = null;
  }

  componentWillMount() {
    NativeModules.OrientationLock.setRotationMode(0); // Lock Landscape
  }

  handleOnReady = () => {
    if (this.videoPlayer) {
      this.videoPlayer.play();
    }
  }

  handleOnErrorOccurred = error => {
    console.log("onErrorOccurred: ", error);
  }

  render() {
    return(
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Video 
          ref={ ref => this.videoPlayer = ref }
          source={this.props.streamInfo}
          onErrorOccurred={this.handleOnErrorOccurred}
          onDurationChanged={() => {}}
          onCurrentTimeUpdated={() =>{}}
          onReady={this.handleOnReady}
          {...this.props}
        />
      </View>
    );
  }
};

export default ACVideo;