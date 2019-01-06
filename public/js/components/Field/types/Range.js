import React, { PureComponent, PropTypes } from 'react';
import Immutable from 'immutable';
import { InputGroup } from 'react-bootstrap';
import Field from '../';

class Range extends PureComponent {

  static propTypes = {
    value: PropTypes.instanceOf(Immutable.Map),
    inputProps: PropTypes.object,
    editable: PropTypes.bool,
    compact: PropTypes.bool,
    placeholder: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        from: PropTypes.string,
        to: PropTypes.string,
      }),
    ]),
    onChange: PropTypes.func,
  };

  static defaultProps = {
    value: Immutable.Map({ from: '', to: '' }),
    placeholder: { from: '', to: '' },
    inputProps: {},
    editable: true,
    compact: false,
    onChange: () => {},
  };

  onChangeFrom = (e) => {
    const { value } = this.props;
    const from = this.getValue(e);
    this.props.onChange(value.set('from', from));
  }

  onChangeTo = (e) => {
    const { value } = this.props;
    const to = this.getValue(e);
    this.props.onChange(value.set('to', to));
  }

  getValue = (e) => {
    const { inputProps: { fieldType = 'text' } } = this.props;
    switch (fieldType) {
      case 'date':
      case 'select':
        return e;
      default:
        return e.target.value;
    }
  }

  render() {
    const {
      onChange,
      value,
      placeholder,
      editable,
      compact,
      inputProps: { fieldType = 'text' },
      ...otherProps
    } = this.props;
    const valueFrom = Immutable.Map.isMap(value) ? value.get('from', '') : '';
    const valueTo = Immutable.Map.isMap(value) ? value.get('to', '') : '';
    const placeholderFrom = typeof placeholder['from'] !== 'undefined' ? placeholder.from : '';
    const placeholderTo = typeof placeholder['to'] !== 'undefined' ? placeholder.to : '';
    if (!editable) {
      return (
        <span className="non-editable-field">{`${valueFrom} - ${valueTo}`}</span>
      );
    }
    return (
      <InputGroup style={{ width: '100%' }}>
        {!compact && (
          <InputGroup.Addon><small>From</small></InputGroup.Addon>
        )}
        <Field
          {...otherProps}
          fieldType={fieldType}
          value={valueFrom}
          onChange={this.onChangeFrom}
          placeholder={placeholderFrom}
        />
        {!compact && (
          <InputGroup.Addon><small>To</small></InputGroup.Addon>
        )}
        {compact && (
          <InputGroup.Addon><small>-</small></InputGroup.Addon>
        )}
        <Field
          {...otherProps}
          fieldType={fieldType}
          value={valueTo}
          onChange={this.onChangeTo}
          placeholder={placeholderTo}
        />
      </InputGroup>
    );
  }

}

export default Range;
