import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import FieldSettings from '../../FieldSettings';

import Number from '../FieldTypes/Number';
import Price from '../FieldTypes/Price';
import Date  from '../FieldTypes/Date';
import Address from '../FieldTypes/Address';
import Text from '../FieldTypes/Text';
import TextArea from '../FieldTypes/TextArea';
import Unlimitd from '../FieldTypes/UnlimitedInput';
import Checkbox from '../FieldTypes/Checkbox';
import Salutation from '../FieldTypes/Salutation';

class Field extends React.Component {
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
          tooltip,
          fieldType = this.getFieldType(id, coll),
          required = false,
          disabled = false,
          editable = true,
          dispatch,
          label = '',
          ...otherProps } = this.props;

    switch(fieldType) {
      case 'number':
        return (<Number {...otherProps} onChange={onChange} ref={id} id={id} value={value} editable={editable} disabled={disabled} />);
      case 'price':
        return (<Price {...otherProps} onChange={onChange} id={id} value={value} editable={editable} disabled={disabled} />);
      case 'date':
        return (<Date onChange={onChange} id={id} value={value} editable={editable} disabled={disabled} />);
      case 'address':
        return (<Address onChange={onChange} id={id} value={value} editable={editable} disabled={disabled} />);
      case 'textarea':
        return (<TextArea onChange={onChange} id={id} value={value} editable={editable} disabled={disabled} />);
      case 'unlimited':
        return (<Unlimitd onChange={onChange} id={id} value={value} editable={editable} disabled={disabled} {...this.props} />);
      case 'checkbox':
        return (<Checkbox onChange={onChange} id={id} value={value} editable={editable} disabled={disabled} label={label} />);
      case 'salutation':
        return (<Salutation {...this.props} />);
      default:
        return (<Text {...otherProps} onChange={onChange} id={id} value={value} editable={editable} required={required} disabled={disabled} />);
    }
  }

  render() {
    return (
      <div className="Field">
        { this.createInput() }
      </div>
    );
  }
}

export default connect()(Field);
