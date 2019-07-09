import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';

const ACTouchable = props => {
  const { children, opacityValue, ...restProps } = props;

  return (
    <TouchableOpacity activeOpacity={opacityValue} {...restProps}>
      {children}
    </TouchableOpacity>
  );
};

ACTouchable.propTypes = {
  children: PropTypes.node.isRequired,
  opacityValue: PropTypes.number.isRequired,
};

export default ACTouchable;
