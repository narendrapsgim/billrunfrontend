import React, { Component, PropTypes } from 'react';
import { InputGroup } from 'react-bootstrap';
import Field from '../Field';


export default class ToggeledInput extends Component {

  static defaultProps = {
    label: 'Enable',
    disabledValue: null,
    disabled: false,
    editable: true,
    suffix: null,
    inputProps: {},
  };

  static propTypes = {
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      null,
    ]),
    disabledValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      null,
    ]),
    label: PropTypes.string,
    disabled: PropTypes.bool,
    editable: PropTypes.bool,
    inputProps: PropTypes.object,
    suffix: PropTypes.node,
    onChange: PropTypes.func.isRequired,
  }

  state = {
    value: this.props.value === this.props.disabledValue ? '' : this.props.value,
    off: this.props.value === this.props.disabledValue,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value && nextProps.value !== nextProps.disabledValue) {
      this.setState({
        value: nextProps.value,
      });
    }
  }

  onChangedState = (e) => {
    const { disabledValue } = this.props;
    const { checked } = e.target;
    const newValue = checked ? this.state.value : disabledValue;
    this.props.onChange(newValue);
    this.setState({ off: !checked });
  }

  onValueChanged = (e) => {
    const { value } = e.target;
    this.setState({ value });
    this.props.onChange(value);
  }

  render() {
    const { value, off } = this.state;
    const { label, disabled, editable, suffix, inputProps } = this.props;

    if (!editable) {
      return (<div className="non-editble-field">{ off ? '' : value }</div>);
    }

    return (
      <InputGroup>
        <InputGroup.Addon>
          <input
            checked={!off}
            onChange={this.onChangedState}
            type="checkbox"
            disabled={disabled}
          /><small style={{ verticalAlign: 'bottom' }}> {label}</small>
        </InputGroup.Addon>
        <Field
          disabled={off || disabled}
          onChange={this.onValueChanged}
          value={off ? '' : value}
          {...inputProps}
        />
        { (suffix !== null) && <InputGroup.Addon>{suffix}</InputGroup.Addon> }
      </InputGroup>
    );
  }

}
