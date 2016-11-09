import React from 'react';

const PlaceHolder = (props) => {
  const { message, ...othetProps } = props;
  return (<p className="PlaceHolder" {...othetProps}>{message}</p>);
};

PlaceHolder.defaultProps = {
  style: { textAlign: 'center', color: '#008cba' },
  message: 'loading...',
};

PlaceHolder.propTypes = {
  message: React.PropTypes.string,
};

export default PlaceHolder;
