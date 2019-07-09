import { FormFactor } from '@youi/react-native-youi';

const styles = {
  durationContainerStyle: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#000',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    padding: 5,
    bottom: 0
  },
  durationTextStyle: {
    fontSize: FormFactor.isHandset ? 18 : 25,
    marginLeft: 10,
    marginRight: 10,
    color: '#FAFAFA'
  },
  progressBarStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    padding: FormFactor.isHandset ? 10 : 10
  },
  trackStyle: {
    backgroundColor: '#DEDEDE',
    height: FormFactor.isHandset ? 10 : 15,
    width: '100%'
  },
  trackFillStyle: {
    backgroundColor: 'red',
    height: FormFactor.isHandset ? 10 : 15,
    width: '100%'
  },
  playPauseStyle : {
    marginLeft: 10
  },
  playBackIcon: {
    width: FormFactor.isHandset ? 20 : 40,
    height: FormFactor.isHandset ? 20 : 40
  }
};

export default styles;