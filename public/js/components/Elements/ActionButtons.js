import React from 'react';
import { Button } from 'react-bootstrap';

const ActionButtons = (props) => {
  const { cancelLabel, saveLabel, hide, hideCancel, hideSave, progress, progressLabel } = props;
  if (hide) {
    return null;
  }
  return (
    <div style={{ marginTop: 12 }}>
      {!hideSave && (
        <Button onClick={props.onClickSave} bsStyle="primary" disabled={progress} style={{ minWidth: 90, marginRight: 10 }}>
          { progress && (<span><i className="fa fa-spinner fa-pulse" />&nbsp;&nbsp;</span>) }
          { progress && progressLabel !== null
            ? progressLabel
            : saveLabel
          }
        </Button>
      )}
      {!hideCancel && (
        <Button onClick={props.onClickCancel} bsStyle="default" style={{ minWidth: 90 }}>
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
  onClickCancel: React.PropTypes.func,
  onClickSave: React.PropTypes.func,
  saveLabel: React.PropTypes.string,
  progressLabel: React.PropTypes.string,
};

export default ActionButtons;
