import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { Col } from 'react-bootstrap';
import { SortableContainer } from 'react-sortable-hoc';

const SortableMenuList = props => (
  <Col lg={12} md={12} className="pr0">
    { props.items.map((item, i) => props.renderMenu(item, i, props.path)) }
  </Col>
);

SortableMenuList.defaultProps = {
  items: Immutable.List(),
  path: [],
};

SortableMenuList.propTypes = {
  path: React.PropTypes.array,
  renderMenu: PropTypes.func.isRequired,
  items: PropTypes.instanceOf(Immutable.List),
};

export default SortableContainer(SortableMenuList);
