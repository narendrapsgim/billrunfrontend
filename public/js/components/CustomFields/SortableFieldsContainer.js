import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { SortableContainer } from 'react-sortable-hoc';

const SortableFieldsContainer = ({ items }) => (<div>{items}</div>);

SortableFieldsContainer.defaultProps = {
  items: [],
};

SortableFieldsContainer.propTypes = {
  items: PropTypes.array,
};
export default connect()(SortableContainer(SortableFieldsContainer));
