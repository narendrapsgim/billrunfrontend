import React, { Component } from 'react';

export default class ActionButtons extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { show, onClickSave, onClickCancel } = this.props;
    if (!show) return (null);

    return (
      <div style={{marginTop: 12}}>
        <button type="submit"
                className="btn btn-primary"
                onClick={onClickSave}
                style={{marginRight: 10}}>
          Save
        </button>
        <button type="reset"
                className="btn btn-default"
                onClick={onClickCancel}>
          Cancel
        </button>
      </div>
    );
  }
}
