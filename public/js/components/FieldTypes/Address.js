import React, { Component } from 'react';

export default class Address extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { onChange, id, value, editable } = this.props;
    const input = editable ? (<input type="text" className="form-control" id={id} value={value} onChange={onChange} />) : (<span>{value}</span>);

    return (
      <div>{input}</div>
    );
  }
}
