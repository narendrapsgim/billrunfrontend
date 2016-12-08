import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { Col } from 'react-bootstrap';
import { SortableElement } from 'react-sortable-hoc';
import EditMenuItem from './EditMenuItem';
import DragHandle from './DragHandle';

const SortableMenuItem = props => (
  <Col md={12} className="pr0">
    <Col md={1}>
      <DragHandle />
    </Col>
    <Col md={11} className="pr0">
      <EditMenuItem
        item={props.item}
        idx={props.idx}
        path={props.path}
        onChangeField={props.onChangeField}
      />
      <Col md={12} className="pr0"><hr style={{ margin: '10px 0' }} /></Col>
      {props.subMenus.size > 0 && props.renderTree(props.subMenus, [...props.newPath, 'subMenus'])}
    </Col>
  </Col>
);

SortableMenuItem.defaultProps = {
  subMenus: Immutable.List(),
};

SortableMenuItem.propTypes = {
  idx: PropTypes.number.isRequired,
  item: PropTypes.instanceOf(Immutable.Map).isRequired,
  newPath: PropTypes.string.isRequired,
  onChangeField: React.PropTypes.func.isRequired,
  path: PropTypes.array.isRequired,
  renderTree: PropTypes.func.isRequired,
  subMenus: PropTypes.instanceOf(Immutable.List),
};

export default SortableElement(SortableMenuItem);
