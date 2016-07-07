import React, { Component } from 'react';

export default class TextArea extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { onChange,
          id,
          value,
          placeholder = "",
          editable } = this.props;

    const input = editable ? (<textarea className="form-control" value={value} onChange={onChange} placeholder={placeholder}></textarea>) : (<span>{value}</span>);

    return (
      <div>{ input }</div>
    );
  }
}
