import React from 'react';
import { Button } from 'react-bootstrap';

const ActionButtons = (props) => {
  const { onClickSave, onClickCancel, cancelLabel, saveLabel, hide, hideCancel } = props;
  if (hide) return null;
  return (
    <div style={{ marginTop: 12 }}>
      <Button onClick={onClickSave} bsStyle="primary" style={{ minWidth: 90, marginRight: 10 }}>{saveLabel}</Button>
      {!hideCancel && <Button onClick={onClickCancel} bsStyle="default" style={{ minWidth: 90 }}>{cancelLabel}</Button>}
      { props.children }
    </div>
  );
};

ActionButtons.defaultProps = {
  children: null,
  hide: false,
  hideCancel: false,
  cancelLabel: 'Cancel',
  saveLabel: 'Save',
  onClickCancel: () => {},
};

ActionButtons.propTypes = {
  children: React.PropTypes.element,
  cancelLabel: React.PropTypes.string,
  hide: React.PropTypes.bool,
  hideCancel: React.PropTypes.bool,
  onClickCancel: React.PropTypes.func,
  onClickSave: React.PropTypes.func.isRequired,
  saveLabel: React.PropTypes.string,
};

export default ActionButtons;
