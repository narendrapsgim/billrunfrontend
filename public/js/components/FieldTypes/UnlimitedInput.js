import React, { Component } from 'react';
import { InputGroup, FormControl } from 'react-bootstrap';


export default class UnlimitedInput extends Component {

  static defaultProps = {
    unlimitedLabel: 'Unlimited',
    unlimitedValue: 'UNLIMITED',
    disabled: false,
    editable: true,
  };

  static propTypes = {
    value: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
    ]).isRequired,
    unlimitedValue: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
    ]),
    unlimitedLabel: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    editable: React.PropTypes.bool,
    onChange: React.PropTypes.func.isRequired,
  }

  state = {
    value: this.props.value === this.props.unlimitedValue ? '' : this.props.value,
    unlimited: this.props.value == this.props.unlimitedValue,
  };

  onUnlimitedChanged = (e) => {
    const { unlimitedValue } = this.props;
    const unlimited = e.target.checked;
    const newValue = unlimited ? unlimitedValue : this.state.value;
    this.setState({ unlimited });
    this.props.onChange(newValue);
  }

  onValueChanged = (e) => {
    const { value } = e.target;
    this.setState({ value });
    this.props.onChange(value);
  }

  render() {
    const { value, unlimited } = this.state;
    const { unlimitedLabel, disabled, editable } = this.props;

    if (!editable) {
      return (<div className="non-editble-field">{ unlimited ? unlimitedLabel : unlimitedLabel }</div>);
    }

    return (
      <InputGroup>
        <InputGroup.Addon>
          <input
              checked={unlimited}
              onChange={this.onUnlimitedChanged}
              type="checkbox"
              disabled={disabled}
          /><small style={{verticalAlign: 'bottom'}}> {unlimitedLabel}</small>
        </InputGroup.Addon>
        <FormControl
            disabled={unlimited || disabled}
            onChange={this.onValueChanged}
            type="text"
            value={unlimited ? '' : value}
        />
      </InputGroup>
    );
  }

}
