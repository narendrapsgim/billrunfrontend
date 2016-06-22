import React, { Component } from 'react';

import FieldSettings from '../../FieldSettings';

import Price from '../FieldTypes/Price';
import Date  from '../FieldTypes/Date';

export default class Field extends Component {
  constructor(props) {
    super(props);

    this.createInput = this.createInput.bind(this);
  }

  createInput() {
    let { onChange,
          id,
          value } = this.props,
    fieldType = FieldSettings[id];

    switch(fieldType) {
      case 'price':
        return (<Price onChange={onChange} id={id} value={value} />);
      case 'date':
        return (<Date onChange={onChange} id={id} value={value} />);
      default:
        return (<input type="text" id={id} className="form-control" value={value} onChange={onChange} />);
    }
  }
  
  render() {
    return (
      <div>
        { this.createInput() }
      </div>
    );
  }
}
