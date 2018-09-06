import React, { PureComponent, PropTypes } from 'react';
import classNames from 'classnames';
import Select from 'react-select';
import Number from './types/Number';
import Price from './types/Price';
import Date from './types/Date';
import DateTime from './types/DateTime';
import Tags from './types/Tags';
import Address from './types/Address';
import Text from './types/Text';
import TextArea from './types/TextArea';
import Unlimitd from './types/UnlimitedInput';
import Checkbox from './types/Checkbox';
import Radio from './types/Radio';
import Salutation from './types/Salutation';
import ToggeledInput from './types/ToggeledInput';
import TextEditor from './types/TextEditor';


class Field extends PureComponent {

  static propTypes = {
    value: PropTypes.any,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    editable: PropTypes.bool,
    fieldType: PropTypes.string,
    label: PropTypes.node,
    style: PropTypes.object,
    className: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
      PropTypes.object,
    ]),
    onChange: PropTypes.func,
  }

  static defaultProps = {
    value: undefined,
    required: false,
    disabled: false,
    editable: true,
    fieldType: 'text',
    label: '',
    style: {},
    className: undefined,
    onChange: () => {},
  }

  createInput = () => {
    const { fieldType, required, label, style, className, ...inputProps } = this.props;
    switch (fieldType) {
      case 'number':
        return (<Number {...inputProps} />);
      case 'price':
        return (<Price {...inputProps} />);
      case 'date':
        return (<Date {...inputProps} />);
      case 'datetime':
        return (<DateTime {...inputProps} />);
      case 'tags':
        return (<Tags {...inputProps} />);
      case 'address':
        return (<Address {...inputProps} />);
      case 'textarea':
        return (<TextArea {...inputProps} />);
      case 'unlimited':
        return (<Unlimitd {...inputProps} />);
      case 'toggeledInput':
        return (<ToggeledInput {...inputProps} label={label} />);
      case 'checkbox':
        return (<Checkbox {...inputProps} label={label} />);
      case 'radio':
        return (<Radio {...inputProps} label={label} />);
      case 'salutation':
        return (<Salutation {...inputProps} />);
      case 'textEditor':
        return (<TextEditor {...inputProps} />);
      case 'select':
        return (<Select {...inputProps} />);
      default:
        return (<Text {...inputProps} required={required} />);
    }
  }

  render() {
    const { style, className } = this.props;
    return (
      <div className={classNames('Field', className)} style={style}>
        { this.createInput() }
      </div>
    );
  }
}

export default Field;
