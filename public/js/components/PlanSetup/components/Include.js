import React, { Component } from 'react';
import { InputGroup, FormControl } from 'react-bootstrap';


const UNLIMITED = 'UNLIMITED';

export default class Include extends Component {

  constructor(props) {
    super(props);
    this.onUnlimitedChnaged = this.onUnlimitedChnaged.bind(this);
    this.onValueChanged = this.onValueChanged.bind(this);

    let unlimited = (props.value === UNLIMITED);
    let value = unlimited ? '' : props.value;
    this.state = { value, unlimited };
  }

  onUnlimitedChnaged(e){
    const unlimited = e.target.checked;
    let newValue = unlimited ? UNLIMITED : this.state.value;
    this.setState({ unlimited });
    this.props.onChangeInclud(newValue);
  }

  onValueChanged(e){
    const { value } = e.target;
    this.setState({ value });
    this.props.onChangeInclud(value);
  }

  render() {
    const { value, unlimited } = this.state;

    return (
      <InputGroup>
        <InputGroup.Addon>
          <input
            type="checkbox"
            label="unlimited"
            onChange={this.onUnlimitedChnaged}
            checked={unlimited}
          /> Unlimited
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
