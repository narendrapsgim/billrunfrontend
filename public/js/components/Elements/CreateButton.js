import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';

const CreateButton = ({ label, onClick, type, disabled }) => (
  <Button bsSize="xsmall" className="btn-primary" onClick={onClick} style={{ marginTop: 15 }} disabled={disabled}>
    <i className="fa fa-plus" />&nbsp;{label}{type.length > 0 && ` ${type}`}
  </Button>
);


CreateButton.defaultProps = {
  label: 'Create New',
  type: '',
  disabled: false,
  onClick: () => {},
};

CreateButton.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default CreateButton;
