import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import FieldSettings from '../../FieldSettings';

import Number from '../FieldTypes/Number';
import Price from '../FieldTypes/Price';
import Date  from '../FieldTypes/Date';
import Address from '../FieldTypes/Address';
import Text from '../FieldTypes/Text';
import TextArea from '../FieldTypes/TextArea';

export default class Field extends Component {
  constructor(props) {
    super(props);

    this.createInput = this.createInput.bind(this);
  }

  getFieldType(id, coll) {
    let c = coll ? coll.toLowerCase() : coll;
    let i = id ? id.toLowerCase() : id;
    if (_.result(FieldSettings, `${c}.${i}`))
      return FieldSettings[c][i];
    return FieldSettings[i];
  }
  
  createInput() {
    let { onChange,
          id,
          value,
          coll,
          fieldType = this.getFieldType(id, coll),
          required = false,
          editable = true } = this.props;

    switch(fieldType) {
      case 'number':
        return (<Number onChange={onChange} ref={id} id={id} value={value} editable={editable} />);
      case 'price':
        return (<Price onChange={onChange} id={id} value={value} editable={editable} />);
      case 'date':
        return (<Date onChange={onChange} id={id} value={value} editable={editable} />);
      case 'address':
        return (<Address onChange={onChange} id={id} value={value} editable={editable} />);
      case 'textarea':
        return (<TextArea onChange={onChange} id={id} value={value} editable={editable} />);
      default:
        return (<Text onChange={onChange} id={id} value={value} editable={editable} required={required}/>);
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
