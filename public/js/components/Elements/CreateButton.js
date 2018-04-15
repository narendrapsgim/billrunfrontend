import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';

const CreateButton = ({ label, onClick, type, disabled, title, buttonStyle }) => (
  <Button bsSize="xsmall" className="btn-primary" onClick={onClick} style={buttonStyle} disabled={disabled} title={title}>
    <i className="fa fa-plus" />&nbsp;{label}{type.length > 0 && ` ${type}`}
  </Button>
);


CreateButton.defaultProps = {
  label: 'Create New',
  type: '',
  title: '',
  disabled: false,
  buttonStyle: { marginTop: 15 },
  onClick: () => {},
};

CreateButton.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  title: PropTypes.string,
  buttonStyle: PropTypes.object,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default CreateButton;
