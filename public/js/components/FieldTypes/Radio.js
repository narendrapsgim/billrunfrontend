import React, { PureComponent, PropTypes } from 'react';
import uuid from 'uuid';


class Radio extends PureComponent {

  static propTypes = {
    name: PropTypes.string.isRequired,
    id: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.string,
    editable: PropTypes.bool,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    id: undefined,
    label: '',
    value: '',
    editable: true,
    checked: false,
    disabled: false,
    onChange: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      id: props.id || uuid.v4(),
    };
  }

  renderInput = () => {
    const { id } = this.state;
    const { name, value, disabled, checked, onChange } = this.props;
    return (
      <input
        type="radio"
        style={{ verticalAlign: 'top' }}
        name={name}
        id={id}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
    );
  }

  render() {
    const { id } = this.state;
    const { value, editable, label, disabled } = this.props;

    if (!editable) {
      return (<span>{ value }</span>);
    }

    const inputField = this.renderInput();
    if (label.length) {
      return (
        <label htmlFor={id} style={{ paddingTop: '10px' }} className={disabled ? 'disabled' : ''}>
          {inputField}
          &nbsp;
          {label}
        </label>
      );
    }

    return inputField;
  }
}


export default Radio;
