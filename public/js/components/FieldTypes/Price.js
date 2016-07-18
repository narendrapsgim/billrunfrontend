import React, { Component } from 'react';

export default class Price extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { onChange, id, value, editable } = this.props;

    const input = editable ? (<div className="input-group">
        <div className="input-group-addon">{globalSetting.currency}</div>
        <input type="number" id={id} className="form-control" value={value} onChange={onChange} />
      </div>) : (<span>{`${globalSetting.currency}${parseFloat(value, 10)}`}</span>);

    return (
      <div>{ input }</div>
    );
  }
}