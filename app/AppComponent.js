import React, { Component } from 'react';
import { View, Dimensions, NativeModules } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { DeviceInfo } from '@youi/react-native-youi';
import { ACVideo, ACScaler, withFairplay, withPassthrough, withWidevine } from './components';

class AppComponent extends Component {
  state = {}

  constructor(props) {
    super(props);

    const { width, height } = Dimensions.get('window');

    this.state = {
      window: {
        width,
        height,
      },
    };

    // 0 = Landscape
    // 1 = Portrait
    // 2 = Auto
    // 3 = LandscapeRight
    // 4 = LandscapeLeft
    // 5 = PortraitUpright
    // 6 = AutoUpright

    NativeModules.OrientationLock.setRotationMode(6);
  }

  componentWillMount() {
    Dimensions.addEventListener('change', this.handleOnOrientationChange);
  }


  componentWillUnmount = () => {
    Dimensions.removeEventListener('change', this.handleOnOrientationChange);
  }

  handleOnOrientationChange = ({ window }) => {
    this.setState({ window });
  }

  render() {
    return(
      <View style={{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <ACScaler
          xRatio={16}
          yRatio={9}
          screenDimensions={this.state.window}
        >
          <ACVideo 
            style={{ width: '100%', height: '100%' }}
            source={this.props.streamInfo}
            continuous={1}
          />
        </ACScaler>
      </View>
    );
  }
};

const mapStateToProps = state => {
  const { streamInfo } = state;

  return { streamInfo };
};

const conditionalDRMHandler = () => {
  if (DeviceInfo.getDeviceModel() === 'Simulator') {
    return withPassthrough;
  }

  switch(DeviceInfo.getSystemName()) {
    case 'iOS':
    case 'tvOS':
      return withFairplay;
    case 'android':
      return withWidevine;
    default:
      return withPassthrough;
  }
};

export default compose(
  connect(mapStateToProps),
  conditionalDRMHandler()
  )(AppComponent);
