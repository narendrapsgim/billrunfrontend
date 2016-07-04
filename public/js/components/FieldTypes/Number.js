import React, { Component } from 'react';

export default class Number extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { onChange, id, value } = this.props;

    return (
      <input type="number" id={id} className="form-control" value={value} onChange={onChange} />
    );
  }
}
