import React, { Component } from 'react';

export default class Price extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { onChange, id, value, editable, disabled, ...otherProps } = this.props;

    const input = editable
      ? <input type="number" {...otherProps} id={id} className="form-control" min="0" value={value} onChange={onChange} disabled={disabled}/>
      : <span>{parseFloat(value, 10)}</span>;

    return (
      <div>{ input }</div>
    );
  }
}
