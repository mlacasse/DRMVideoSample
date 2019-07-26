import React, { PureComponent } from 'react';
import { View, FlatList, Text, NativeModules, NativeEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { DeviceInfo } from '@youi/react-native-youi';
import { ACVideo, ACScaler, withFairplay, withPassthrough, withWidevine } from './components';

const { Dimensions } = NativeModules;

const YOStream = {
  uri: 'http://csm-e.cds1.yospace.com/csm/live/143389657.m3u8?yo.br=false&yo.ac=true',
  type: 'HLS',
}
const CLEARStream = {
  uri: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_16x9/bipbop_16x9_variant.m3u8',
  type: 'HLS',
}

class AppComponent extends PureComponent {
  constructor(props) {
    super(props);

    const { width, height } = Dimensions.window;

    this.state = {
      isClear: false,
      streamInfo: this.props.streamInfo,
      window: {
        width,  
        height,
      },
      tags: [],
    };

    // 0 = Landscape
    // 1 = Portrait
    // 2 = Auto
    // 3 = LandscapeRight
    // 4 = LandscapeLeft
    // 5 = PortraitUpright
    // 6 = AutoUpright

    NativeModules.OrientationLock.setRotationMode(6);

    this.dimensionsChangeEvent = new NativeEventEmitter(Dimensions);
  }

  componentWillMount = () => {
    this.dimensionsChangeEvent.addListener('change', this.handleOnOrientationChange);
  }

  componentWillUnmount = () => {
    this.dimensionsChangeEvent.removeListener('change', this.handleOnOrientationChange);
  }

  toggleStreamInfo = (streamInfo) => {
    if (this.state.isClear) {
      this.setState({ streamInfo: this.props.streamInfo, isClear: false, tags: []  })
    } else {
      this.setState({ streamInfo, isClear: true, tags: [] })
    }
  }

  handleOnOrientationChange = ({ window }) => {
    this.setState({ window });
  }

  handleOnSwipeRight = () => {
    this.toggleStreamInfo(CLEARStream);
  }

  handleOnSwipeLeft = () => {
    this.toggleStreamInfo(YOStream);
  }

  handleOnTimedMetadata = (metadata) => {
    this.setState({ tags: [...this.state.tags, metadata.nativeEvent] });
  }

  renderItemSeparator = () => {
    return (
      <View style={{height: 0.5, width: '100%', backgroundColor: '#C8C8C8'}}/>
    );
  }

  renderItem = (item, index) => {
    const elapsed = {
      seconds: Math.floor((item.timestamp / 1000000) % 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}),
      minutes: Math.floor((item.timestamp / (1000000*60)) % 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}),
      hours: Math.floor((item.timestamp / (1000000*60*60)) % 60),
    }

    return(
      <View style={{ flex: 1, flexDirection: 'column', padding: 10, backgroundColor: 'grey' }}>
        <View style={{ flex: 1, alignItems: 'flex-end', paddingBottom: 10 }}>
          <Text style={{ fontSize: 14, color: 'white' }}>@ {elapsed.hours}:{elapsed.minutes}:{elapsed.seconds}</Text>
        </View>
        <Text style={{ fontSize: 14, color: 'white', paddingBottom: 10 }}>{item.identifier}</Text>
        <Text style={{ fontSize: 14, color: 'white' }}>{item.value}</Text>
      </View>
    );
  }

  render = () => {
    const { width, height } = this.state.window;

    return(
      <View style={{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'black',
      }}>
        <ACScaler
          xRatio={16}
          yRatio={9}
          screenDimensions={{ width, height }}
        >
          <ACVideo 
            source={this.state.streamInfo}
            continuous={1}
            onTimedMetadata={this.handleOnTimedMetadata}
            onSwipeLeft={this.handleOnSwipeLeft}
            onSwipeRight={this.handleOnSwipeRight}
          />
        </ACScaler>
        <FlatList
          style={{ width: '100%' }}
          data={this.state.tags}
          keyExtractor={item => "" + item.timestamp}
          ItemSeparatorComponent={this.renderItemSeparator}
          renderItem={({item, index}) => this.renderItem(item, index)}
        />
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
