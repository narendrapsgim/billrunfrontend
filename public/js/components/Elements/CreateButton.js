import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';

const CreateButton = ({ label, onClick, type }) => (
  <Button bsSize="xsmall" className="btn-primary" onClick={onClick} style={{ marginTop: 15 }}>
    <i className="fa fa-plus" />&nbsp;{label}{type.length > 0 && ` ${type}`}
  </Button>
);


CreateButton.defaultProps = {
  label: 'Create New',
  type: '',
  onClick: () => {},
};

CreateButton.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
};

export default CreateButton;
