import React from 'react';
import { Button } from 'react-bootstrap';

const ActionButtons = (props) => {
  const { cancelLabel, saveLabel, hide, hideCancel, hideSave } = props;
  if (hide) {
    return null;
  }
  return (
    <div style={{ marginTop: 12 }}>
      {!hideSave && <Button onClick={props.onClickSave} bsStyle="primary" style={{ minWidth: 90, marginRight: 10 }}>{saveLabel}</Button>}
      {!hideCancel && <Button onClick={props.onClickCancel} bsStyle="default" style={{ minWidth: 90 }}>{cancelLabel}</Button>}
      { props.children }
    </div>
  );
};

ActionButtons.defaultProps = {
  children: null,
  hide: false,
  hideCancel: false,
  hideSave: false,
  cancelLabel: 'Cancel',
  saveLabel: 'Save',
  onClickCancel: () => {},
  onClickSave: () => {},
};

ActionButtons.propTypes = {
  children: React.PropTypes.element,
  cancelLabel: React.PropTypes.string,
  hide: React.PropTypes.bool,
  hideCancel: React.PropTypes.bool,
  hideSave: React.PropTypes.bool,
  onClickCancel: React.PropTypes.func,
  onClickSave: React.PropTypes.func,
  saveLabel: React.PropTypes.string,
};

export default ActionButtons;
