import React, { Component } from 'react';

export default class Field extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { label, type, mandatory = false } = this.props.field;

    if (type === "select") {
      let options = this.props.field.options.map((op, key) => {
        return (
          <option value={op.value} key={key}>{op.label}</option>
        );
      });

      return (
        <div className="form-group">
          <label htmlFor="">{ mandatory ? `*${label}` : label}</label>
          <select className="form-control" id="">
            {options}
          </select>
        </div>
      );
    }

    return (
      <div className="form-group">
        <label htmlFor="">{ mandatory ? `*${label}` : label}</label>
        <input type={type} className="form-control" id="" />
      </div>
    );
  }
};
