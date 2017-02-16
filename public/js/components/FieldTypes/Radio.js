import React, { Component } from 'react';
import uuid from 'uuid';

class Radio extends Component {

  static defaultProps = {
    id: uuid.v4(),
    label: '',
    value: '',
    editable: true,
    checked: false,
    disabled: false,
    onChange: () => {},
  };

  static propTypes = {
    name: React.PropTypes.string.isRequired,
    id: React.PropTypes.string,
    label: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    editable: React.PropTypes.bool,
    checked: React.PropTypes.bool,
    disabled: React.PropTypes.bool,
    onChange: React.PropTypes.func,
  };

  renderInput = () => {
    const { name, id, value, disabled, checked, onChange } = this.props;
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
    const { id, value, editable, label } = this.props;
    if (!editable) {
      return (<span>{ value }</span>);
    }

    if (label.length) {
      return (
        <label htmlFor={id} style={{ paddingTop: '10px' }}>
          {this.renderInput()}
          {label}
        </label>
      );
    }

    return this.renderInput();
  }
}

export default Radio;
