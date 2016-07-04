import React, { Component } from 'react';
import _ from 'lodash';

import FieldSettings from '../../FieldSettings';

import Number from '../FieldTypes/Number';
import Price from '../FieldTypes/Price';
import Date  from '../FieldTypes/Date';
import Address from '../FieldTypes/Address';

export default class Field extends Component {
  constructor(props) {
    super(props);

    this.createInput = this.createInput.bind(this);
  }

  getFieldType(id, coll) {
    if (_.result(FieldSettings, `${coll}.${id}`))
      return FieldSettings[coll][id];
    return FieldSettings[id];
  }
  
  createInput() {
    let { onChange,
          id,
          value,
          coll } = this.props;
    let fieldType = this.getFieldType(id, coll);

    switch(fieldType) {
      case 'number':
        return (<Number onChange={onChange} id={id} value={value} />);
      case 'price':
        return (<Price onChange={onChange} id={id} value={value} />);
      case 'date':
        return (<Date onChange={onChange} id={id} value={value} />);
      case 'address':
        return (<Address onChange={onChange} id={id} value={value} />);
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
