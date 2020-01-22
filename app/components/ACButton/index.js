import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Image, TouchableOpacity } from 'react-native';
import { FormFactor } from '@youi/react-native-youi';

class ACButton extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func.isRequired,
    source: PropTypes.object.isRequired,
    style: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      focused: false,
    };
  }

  handleOnFocus = () => {
    this.setState({ focused: true });
  }

  handleOnBlur = () => {
    this.setState({ focused: false });
  }

  render() {
    const { onPress, source, style } = this.props;

    const touchableStyle = this.state.focused ? Styles.focused : Styles.unfocused;

    return (
      <TouchableOpacity onFocus={this.handleOnFocus} onBlur={this.handleOnBlur} onPress={onPress}>
        <View style={touchableStyle}>
          <Image source={source} style={style} />
        </View>
      </TouchableOpacity>
    );
  }
}

const Styles = {
  focused: {
    marginLeft: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: FormFactor.isTV ? 300 : 40,
    height: FormFactor.isTV ? 300 : 40,
    borderColor: 'white',
    borderWidth: FormFactor.isTV ? 1 : 0,
  },
  unfocused: {
    marginLeft: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: FormFactor.isTV ? 300 : 40,
    height: FormFactor.isTV ? 300 : 40,
  },
};

export default ACButton;
