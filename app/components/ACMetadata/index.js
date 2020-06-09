import React, { PureComponent } from 'react';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';

class ACMetadata extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
  };


  render() {
    const { style, title, description } = this.props

    if (title === undefined) return null;

    return (
      <View>
        <Text style={style}>{title}</Text>
        <Text style={style}>{description}</Text>
      </View>
    );
  }
};

export default ACMetadata;