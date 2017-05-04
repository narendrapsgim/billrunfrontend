import React from 'react';
import { Button } from 'react-bootstrap';

const ActionButtons = (props) => {
  const { hide, progress, progressLabel } = props;
  const { saveLabel, hideSave, disableSave, onClickSave } = props;
  const { cancelLabel, hideCancel, disableCancel, onClickCancel } = props;
  if (hide) {
    return null;
  }
  return (
    <div style={{ marginTop: 12 }}>
      {!hideSave && (
        <Button onClick={onClickSave} bsStyle="primary" disabled={progress || disableSave} style={{ minWidth: 90, marginRight: 10 }}>
          { progress && (<span><i className="fa fa-spinner fa-pulse" />&nbsp;&nbsp;</span>) }
          { progress && progressLabel !== null
            ? progressLabel
            : saveLabel
          }
        </Button>
      )}
      {!hideCancel && (
        <Button onClick={onClickCancel} bsStyle="default" disabled={disableCancel} style={{ minWidth: 90 }}>
          {cancelLabel}
        </Button>
      )}
      { props.children }
    </div>
  );
};

ActionButtons.defaultProps = {
  children: null,
  hide: false,
  hideCancel: false,
  hideSave: false,
  progress: false,
  disableSave: false,
  disableCancel: false,
  cancelLabel: 'Cancel',
  saveLabel: 'Save',
  progressLabel: null,
  onClickCancel: () => {},
  onClickSave: () => {},
};

ActionButtons.propTypes = {
  children: React.PropTypes.element,
  cancelLabel: React.PropTypes.string,
  hide: React.PropTypes.bool,
  hideCancel: React.PropTypes.bool,
  hideSave: React.PropTypes.bool,
  progress: React.PropTypes.bool,
  disableSave: React.PropTypes.bool,
  disableCancel: React.PropTypes.bool,
  onClickCancel: React.PropTypes.func,
  onClickSave: React.PropTypes.func,
  saveLabel: React.PropTypes.string,
  progressLabel: React.PropTypes.string,
};

export default ActionButtons;
