import React, { PropTypes } from 'react';
import { SortableHandle } from 'react-sortable-hoc';

const DragHandle = ({ element }) => element;

DragHandle.defaultProps = {
  element: <i className="fa fa-bars fa-fw" style={{ cursor: 'row-resize', opacity: '.25', lineHeight: '35px' }} />,
};

DragHandle.propTypes = {
  element: PropTypes.element.isRequired,
};

export default SortableHandle(DragHandle);
