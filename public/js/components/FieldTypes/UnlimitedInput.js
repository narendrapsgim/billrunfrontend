import React, { Component } from 'react';
import { InputGroup, FormControl } from 'react-bootstrap';


export default class UnlimitedInput extends Component {

  static propTypes = {
    unlimitedValue: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.onUnlimitedChnaged = this.onUnlimitedChnaged.bind(this);
    this.onValueChanged = this.onValueChanged.bind(this);
    this.unlimitedValue = props.unlimitedValue;
    this.unlimitedLabel = (typeof props.unlimitedLabel === 'undefined') ? 'Unlimited' : props.unlimitedLabel;

    let unlimited = (props.value === this.unlimitedValue);
    let value = unlimited ? '' : props.value;
    this.state = { value, unlimited };
  }

  onUnlimitedChnaged(e){
    const unlimited = e.target.checked;
    let newValue = unlimited ? this.unlimitedValue : this.state.value;
    this.setState({ unlimited });
    this.props.onChange(newValue);
  }

  onValueChanged(e){
    const { value } = e.target;
    this.setState({ value });
    this.props.onChange(value);
  }

  render() {
    const { value, unlimited } = this.state;

    return (
      <InputGroup>
        <InputGroup.Addon>
          <input
            type="checkbox"
            onChange={this.onUnlimitedChnaged}
            checked={unlimited}
          /> {this.unlimitedLabel}
        </InputGroup.Addon>
        <FormControl
          type="text"
          value={unlimited ? '' : value}
          disabled={unlimited}
          onChange={this.onValueChanged}
        />
      </InputGroup>
    );
  }

}
