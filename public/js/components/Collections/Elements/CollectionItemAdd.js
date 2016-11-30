import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';

const CollectionItemAdd = ({ onClickNew, addLabel }) => (
  <div className="col-md-3 collections-item-display add-new">
    <div className="panel panel-default ">
      <Button bsStyle="link" bsSize="xsmall" onClick={onClickNew}>
        <i className="fa fa-plus" />&nbsp;{addLabel}
      </Button>
    </div>
  </div>
);

CollectionItemAdd.defaultProps = {
  addLabel: 'Add Collection',
};

CollectionItemAdd.propTypes = {
  addLabel: PropTypes.string,
  onClickNew: PropTypes.func.isRequired,
};

export default CollectionItemAdd;
