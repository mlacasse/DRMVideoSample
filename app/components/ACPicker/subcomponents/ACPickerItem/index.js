import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import { FormFactor } from '@youi/react-native-youi';

class ACPickerItem extends PureComponent {
  static propTypes = {
    value: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      focused: false,
    };
  }

  handleOnFocus = () => {
    this.setState({ focused: true });
  };

  handleOnBlur = () => {
    this.setState({ focused: false });
  };

  handleOnPress = ref => {
    if (this.props.onPress) {
      this.props.onPress(this.props.id);
    }
  };

  render() {
    const { value } = this.props;

    const touchableStyle = this.state.focused ? Styles.focused : Styles.unfocused;

    return (
        <TouchableOpacity onFocus={this.handleOnFocus} onBlur={this.handleOnBlur} onPress={this.handleOnPress}>
          <View style={touchableStyle}>
            <Text style={Styles.textStyle}>{value}</Text>
          </View>
        </TouchableOpacity>
    );
  }
}

const Styles = {
  focused: {
    borderColor: '#DEDEDE',
    borderWidth: 1,
  },
  unfocused: {
    borderColor: '#DEDEDE',
    borderWidth: 0,
  },
  textStyle: {
    margin: FormFactor.isTV ? 10 : 5,
    fontSize: FormFactor.isTV ? 25 : 18,
    marginLeft: FormFactor.isTV ? 10 : 5,
    color: '#FAFAFA',
  },
};

export default ACPickerItem;
