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
          required = false,
          disabled = false,
          editable = true,
          ...otherProps } = this.props;

    const input = editable ? (<input {...otherProps} type="text" id={id} className="form-control" value={value} onChange={onChange} placeholder={placeholder} required={required} disabled={disabled} />) : (<span>{value}</span>);

    return (
      <div>{ input }</div>
    );
  }
}
