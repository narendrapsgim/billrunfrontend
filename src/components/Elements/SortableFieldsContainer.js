import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { SortableContainer } from 'react-sortable-hoc';
import Immutable from 'immutable';


const SortableFieldsContainer = ({ items }) => (<div>{items}</div>);

SortableFieldsContainer.defaultProps = {
  items: [],
};

SortableFieldsContainer.propTypes = {
  items: PropTypes.oneOfType([
    PropTypes.instanceOf(Immutable.List),
    PropTypes.array,
  ]),
};
export default connect()(SortableContainer(SortableFieldsContainer));
