import React, { Component } from 'react';
import Chip from './Chip';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export default class Chips extends Component {

  static propTypes = {
    onChange: React.PropTypes.func.isRequired,
    options: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        key: React.PropTypes.oneOfType([
          React.PropTypes.string,
          React.PropTypes.number,
        ]),
        value: React.PropTypes.oneOfType([
          React.PropTypes.string,
          React.PropTypes.number,
        ])
      })
    ),
    items: React.PropTypes.arrayOf(
      React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number,
      ]).isRequired
    )
  }

  static defaultProps = {
    items: [],
    options: [],
    inputType: 'text',
    disabled: false,
    errorText: '',
    errorStyle: '',
    placeholder: '',
  }

  state = {
    inputValue: '',
    inFocus: false
  }

  addItem = () => {
    const { inputValue } = this.state;
    if(inputValue.length > 0){
      this.setState({ inputValue : '' });
      const items = [...this.props.items, inputValue];
      this.props.onChange(items);
    }
  }

  onRemoveItem = (index) => {
    if(Number.isInteger(index)){
      const items = this.props.items.filter((item, i) => i !== index);
      this.props.onChange(items);
    }
  }

  onKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.addItem();
    }
  }

  onInputBlur = (e) => {
    this.setState({ inFocus: false });
  }

  onInputFocus = (e) => {
    this.setState({ inFocus: true });
  }

  onInputChange = (e) => {
    const { value } = e.target;
    this.setState({ inputValue: value });
  }

  onSelectChange = (e, index, value) => {
    this.setState({ inputValue: value }, this.addItem);
  }

  getInputByType  = () => {
    const { items, inputType, disabled, errorText, errorStyle, placeholder } = this.props;

    switch (inputType) {
      case 'select':
            const options = this.props.options
              .filter((option, i) => !items.includes(option.key) )
              .map((option, index) => <MenuItem key={index} value={option.key} primaryText={option.value} /> );
            return (
              <SelectField style={{verticalAlign: 'bottom'}}
                onFocus={this.onInputFocus}
                onBlur={this.onInputBlur}
                onChange={this.onSelectChange}
                hintText={placeholder}
              > {options} </SelectField>
            );
        break;

      case 'text':
      default:
          return (
            <div>
            <TextField style={{marginLeft: 10, marginRight: 5}}
               value={this.state.inputValue}
               onBlur={this.onInputBlur}
               onFocus={this.onInputFocus}
               onKeyPress={this.onKeyPress}
               onChange={this.onInputChange}
               errorText={errorText}
               errorStyle={errorStyle}
               hintText={placeholder}
             />
           <i className="fa fa-plus-circle fa-lg" onClick={this.addItem} style={{cursor: "pointer", color: 'green'}} ></i>
           </div>
          );
    }
  }

  getChips = () => {
    const { disabled, items } = this.props;
    return items.map((item, index) =>
      <Chip value={item} index={index} onRemoveClick={this.onRemoveItem} key={index} allowRemove={!disabled} />
    );
  }

  render() {
    const { disabled } = this.props;
    return (
      <div style={{ paddingBottom: 10, position: 'relative' }}>
        <div style={{ display: 'inline-block', marginLeft: -8}}>
          { this.getChips() }
        </div>
        {!disabled && this.getInputByType()}
      </div>
    );
  }
}
