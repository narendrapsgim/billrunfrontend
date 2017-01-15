import React, { Component } from 'react';
import { InputGroup, FormControl } from 'react-bootstrap';


export default class UnlimitedInput extends Component {

  static defaultProps = {
    unlimitedLabel: 'Unlimited',
    unlimitedValue: 'UNLIMITED',
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
    onChange: React.PropTypes.func.isRequired,
  }

  state = {
    value: this.props.value === this.props.unlimitedValue ? '' : this.props.value,
    unlimited : this.props.value == this.props.unlimitedValue
  };

  onUnlimitedChanged = (e) => {
    const { unlimitedValue } = this.props;
    const unlimited = e.target.checked;
    let newValue = unlimited ? unlimitedValue : this.state.value;
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
    const { unlimitedLabel } = this.props;

    return (
      <InputGroup>
        <InputGroup.Addon>
          <input
              checked={unlimited}
              onChange={this.onUnlimitedChanged}
              type="checkbox"
          /><small style={{verticalAlign: 'bottom'}}> {unlimitedLabel}</small>
        </InputGroup.Addon>
        <FormControl
            disabled={unlimited}
            onChange={this.onValueChanged}
            type="text"
            value={unlimited ? '' : value}
        />
      </InputGroup>
    );
  }

}
