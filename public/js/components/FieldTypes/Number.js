import React, { Component } from 'react';

export default class Number extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { onChange, id, value, editable, disabled, fieldType, tooltip } = this.props;
    const input = editable ?
                  (<input type="number" id={id} className="form-control" value={value} onChange={onChange} disabled={disabled} title={tooltip} />) :
                  (<span>{parseFloat(value, 10)}</span>);

    return (
      <div>{ input }</div>
    );
  }
}
