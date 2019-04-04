import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

const CreateButton = ({ label, onClick, type, action, disabled, title, buttonStyle }) => (
  <Button bsSize="xsmall" className="btn-primary" onClick={onClick} style={buttonStyle} disabled={disabled} title={title}>
    <i className="fa fa-plus" />
    {action.length > 0 && ` ${action}`}
    {label.length > 0 && ` ${label}`}
    {type.length > 0 && ` ${type}`}
  </Button>
);


CreateButton.defaultProps = {
  label: 'New',
  action: '',
  type: '',
  title: '',
  disabled: false,
  buttonStyle: { marginTop: 15 },
  onClick: () => {},
};

CreateButton.propTypes = {
  label: PropTypes.string,
  action: PropTypes.string,
  type: PropTypes.string,
  title: PropTypes.string,
  buttonStyle: PropTypes.object,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default CreateButton;
