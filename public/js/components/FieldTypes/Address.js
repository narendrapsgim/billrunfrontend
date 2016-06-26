import React, { Component } from 'react';

export default class Address extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { onChange, id, value } = this.props;

    return (
      <input type="text" className="form-control" id={id} value={value} onChange={onChange} />
    );
  }
}
