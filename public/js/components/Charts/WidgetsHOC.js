import React, { PropTypes } from 'react';
import PlaceHolder from './PlaceHolder';

const WidgetsHOC = (ComposedComponent) => {
  const WidgetWrapper = ({ placeHolderProps, width, height, ...chartProps }) => (
    (chartProps.data === null)
      ? <PlaceHolder {...placeHolderProps} width={width} height={height} />
      : <ComposedComponent {...chartProps} width={width} height={height} />
  );

  WidgetWrapper.defaultProps = {
    data: null,
  };

  WidgetWrapper.propTypes = {
    data: PropTypes.any,
    placeHolderProps: PropTypes.object,
    width: PropTypes.number,
    height: PropTypes.number,
  };

  return WidgetWrapper;
};

export default WidgetsHOC;
