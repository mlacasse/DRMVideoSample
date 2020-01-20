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
  pauseIcon: FormFactor.select({
    Handset: {
      width: 12.5,
      height: 18,
    },
    Tablet: {
      width: 25,
      height: 36,
    },
    default: {
      width: 250,
      height: 360,
    },
  }),
  playIcon: FormFactor.select({
    Handset: {
      width: 12.5,
      height: 14.5,
    },
    Tablet: {
      width: 25,
      height: 29,
    },
    default: {
      width: 250,
      height: 290,
    },
  }),
  ccIcon: FormFactor.select({
    Handset: {
      width: 25,
      height: 25,
    },
    Tablet: {
      width: 50,
      height: 50,
    },
    default: {
      width: 250,
      height: 250,
    },
  }),
  buttonStyle: FormFactor.select({
    Handset: {
      marginLeft: 5,
      alignItems: 'center',
      justifyContent: 'center',
      width: 40,
      height: 40,
    },
    Tablet: {
      marginLeft: 10,
      alignItems: 'center',
      justifyContent: 'center',
      width: 50,
      height: 50,
    },
    default: {
      marginRight: 5,
      alignItems: 'center',
      justifyContent: 'center',
      width: 300,
      height: 300,
    },
  }),
  buttonFocusedStyle: FormFactor.select({
    Handset: {
      marginLeft: 5,
      alignItems: 'center',
      justifyContent: 'center',
      width: 40,
      height: 40,
    },
    Tablet: {
      marginLeft: 10,
      alignItems: 'center',
      justifyContent: 'center',
      width: 50,
      height: 50,
    },
    default: {
      marginRight: 5,
      alignItems: 'center',
      justifyContent: 'center',
      width: 300,
      height: 300,
      borderColor: 'white',
      borderWidth: 5,
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