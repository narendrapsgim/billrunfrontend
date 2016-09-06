import React, { Component } from 'react';

export default class Address extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { onChange, id, value, editable, disabled } = this.props;
    const input = editable ? (<input type="text" className="form-control" id={id} value={value} onChange={onChange} disabled={disabled}/>) : (<span>{value}</span>);

    return (
      <div>{input}</div>
    );
  }
}
