import React, { Component } from 'react';

export default class Text extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { onChange,
          id,
          value,
          placeholder = "",
          editable } = this.props;

    const input = editable ? (<input type="text" className="form-control" value={value} onChange={onChange} placeholder={placeholder} />) : (<span>{value}</span>);

    return (
      <div>{ input }</div>
    );
  }
}
