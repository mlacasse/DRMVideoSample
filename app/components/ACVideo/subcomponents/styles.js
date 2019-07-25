import { FormFactor } from '@youi/react-native-youi';

const ACVideoStyles = {
  elapsedStyle: {
    fontSize: FormFactor.isHandset ? 14 : 25,
    marginLeft: 10,
    marginRight: 10,
    color: '#FAFAFA',
  },
  playPauseStyle : {
    marginLeft: 15,
    marginRight: 5,
  },
  playBackIcon: {
    width: FormFactor.isHandset ? 20 : 40,
    height: FormFactor.isHandset ? 20 : 40,
  },
  progressBarStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    marginLeft: 10,
    marginRight: 10,
  },
  trackStyle: {
    backgroundColor: '#DEDEDE',
    height: FormFactor.isHandset ? 5 : 10,
    width: '100%'
  },
  trackFillStyle: {
    backgroundColor: 'red',
    height: FormFactor.isHandset ? 5 : 10,
    width: '100%'
  },
};

export { ACVideoStyles };