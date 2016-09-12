import React, { Component } from 'react';
import Chip from './Chip';
import TextField from 'material-ui/TextField';
import theme from '../../theme'
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import AutoComplete from 'material-ui/AutoComplete';

const styles = {
  wrapper: {
    paddingBottom: '10px',
    position: 'relative'
  },
  label: {
    position: 'absolute',
    lineHeight: '22px',
    top: 15,
    zIndex: 1, // Needed to display label above Chrome's autocomplete field background
    cursor: 'text',
    transform: 'scale(1) translate3d(0, 0, 0)',
    transformOrigin: 'left top',
    pointerEvents: 'auto',
    color: theme.palette.accent3Color,
    transformOrigin: 'left top 0px',
    margin: '0px',
    fontSize: '85%'
  },
  labelFocus: {
    position: 'absolute',
    lineHeight: '22px',
    top: 15,
    zIndex: 1, // Needed to display label above Chrome's autocomplete field background
    cursor: 'text',
    transform: 'scale(1) translate3d(0, 0, 0)',
    transformOrigin: 'left top',
    pointerEvents: 'auto',
    color: theme.palette.primary1Color,
    margin: '0px',
    fontSize: '85%'
  },
  input: {marginLeft: '10px'},
  select: {verticalAlign: 'bottom'},
  chipsWrapper: {
    display: 'inline-block',
    marginLeft: '-8px',
  }
}

export default class Chips extends Component {
  constructor(props) {
    super(props);

    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.onRremoveItem = this.onRremoveItem.bind(this);
    this.onChipsChange = this.onChipsChange.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.onInputFocus = this.onInputFocus.bind(this);
    this.onInputBlur = this.onInputBlur.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.getInputByType = this.getInputByType.bind(this);

    let items = this.props.items || [];
    if (!_.isEmpty(this.props.items) && !_.isArray(this.props.items)){
        items = [this.props.items]
    }

    let options = this.props.options || [];
    if (!_.isEmpty(this.props.options) && !_.isArray(this.props.options)){
        options = [this.props.options]
    }

    this.state = {
      items: items,
      options: options,
      inputValue: '',
      inFocus: false
    };
  }

  onChipsChange(){
    this.props.onChange(this.state.items);
  }

  addItem(){
    let value = this.state.inputValue;
    if(value.length > 0){
      this.setState({
        items: [...this.props.items, value],
        inputValue : '',
      }, this.onChipsChange);
    }
  }

  removeItem(index){
    let newOptions = this.state.options;
    if(typeof this.props.options !== 'undefined'){
      let returnOption = this.props.options.find((option, i) => option['key'] === this.state.items[index] );
      newOptions = (typeof returnOption !== 'undefined') ? [...this.state.options, returnOption] : this.state.options
    }
    if(Number.isInteger(index)){
      this.setState({
        items: this.state.items.filter((item, i) => i !== index),
        options: newOptions
      }, this.onChipsChange);
    }
  }

  onRremoveItem(index){
    this.removeItem(index);
  }

  onKeyPress(e){
    if (e.key === 'Enter') {
      this.addItem();
    }
  }
  onInputBlur(e){
    this.setState({
        inFocus: false
    });
  }
  onInputFocus(e){
    this.setState({
        inFocus: true
    });
  }

  onInputChange(e) {
    this.setState({
        inputValue: e.target.value
    });
  }

  onSelectChange(e, index, value){
    this.setState({
        inputValue: value,
        options: this.state.options.filter(option => option['key'] !==  value)
    }, this.addItem);
  }

  getInputByType(){
    const {label, disabled, errorText, errorStyle, inputType} = this.props;
    if(typeof inputType !== 'undefined' && 'select' == inputType){
      let options = null;
      if(this.state.options.length > 0){
        options = this.state.options.map((option, index) =>
          <MenuItem key={index} value={option.key} primaryText={option.value} />
        );
      }
      return (
        <SelectField
          style={styles.select}
          name="newChips"
          onFocus={this.onInputFocus}
          onBlur={this.onInputBlur}
          onChange={this.onSelectChange}
          hintText={"Select " + label.toLowerCase()}
          >
          {options}
        </SelectField>);
    }
    // else retun text input
    return (
      <TextField
         name="newChips"
         value={this.state.inputValue}
         onBlur={this.onInputBlur}
         onFocus={this.onInputFocus}
         onKeyPress={this.onKeyPress}
         onChange={this.onInputChange}
         errorText={errorText}
         errorStyle={errorStyle}
         style={styles.input}
       />
   );
 }

  getChips(){
    const {disabled, style, items} = this.props;
    let chips = items.map((item, index) =>
      <Chip value={item} index={index} onRemoveClick={this.onRremoveItem} key={index} allowRemove={!disabled} />
    );
    return chips;
  }

  render() {
    const {label, disabled, style} = this.props;
    let wrapperStyle = (typeof style !== 'undefined' && typeof style.wrapper !== 'undefined' ) ? Object.assign({}, styles.wrapper, style.wrapper) : styles.wrapper ;
    return (
      <div style={wrapperStyle}>
        <div style={styles.chipsWrapper}>{this.getChips()}</div>
        {disabled ? (null) : this.getInputByType()}
      </div>
    );
  }
}
