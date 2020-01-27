import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, FlatList } from 'react-native';
import { FormFactor } from '@youi/react-native-youi';

import ACPickerItem from './subcomponents/ACPickerItem';

class ACPicker extends PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired,
    onPress: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  renderItem = ({ item, separators, index }) => {
    const { onPress } = this.props;

    return <ACPickerItem id={item.uniqueId} value={item.friendlyName} onPress={onPress} />;
  };

  render() {
    const { data, style } = this.props;

    return (
      <View style={style}>
        <FlatList
          data={data}
          keyExtractor={data => data.uniqueId}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

export default ACPicker;
