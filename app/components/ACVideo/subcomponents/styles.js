import { FormFactor } from '@youi/react-native-youi';

const ACVideoStyles = {
  elapsedStyle: FormFactor.select({
    Handset: {
      fontSize: 14,
      marginLeft: 5,
      color: '#FAFAFA',
    },
    Tablet: {
      fontSize: 18,
      marginLeft: 10,
      color: '#FAFAFA',
    },
    default: {
      fontSize: 25,
      marginLeft: 10,
      color: '#FAFAFA',
    },
  }),
  playPauseStyle : FormFactor.select({
    Handset: {
      marginRight: 5,
      padding: 5,
    },
    Tablet: {
      marginRight: 10,
      padding: 5,
    },
    default: {
      marginRight: 15,
      padding: 5,
    },
  }),
  playBackIcon: FormFactor.select({
    Handset: {
      width: 20,
      height: 20,
    },
    Tablet: {
      width: 25,
      height: 25,
    },
    default: {
      width: 40,
      height: 40,
    },
  }),
  ccStyle : FormFactor.select({
    Handset: {
      marginRight: 5,
      marginLeft: 5,
      padding: 5,
    },
    default: {
      marginRight: 10,
      marginLeft: 10,
      padding: 5,
    },
  }),
  ccIcon: FormFactor.select({
    Handset: {
      width: 20,
      height: 10,
    },
    Tablet: {
      width: 20,
      height: 10,
    },
    default: {
      width: 35,
      height: 18,
    },
  }),
  progressBarStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    marginLeft: 5,
  },
  trackStyle: {
    backgroundColor: '#DEDEDE',
    height: 10,
    width: '100%'
  },
  trackFillStyle: {
    backgroundColor: 'red',
    height: 10,
    width: '100%'
  },
  playerControlsStyle: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'black',
    alignItems: 'center',
    position: 'absolute',
    padding: 5,
    marginBottom: 20,
    bottom: 0,
  },
};

export { ACVideoStyles };