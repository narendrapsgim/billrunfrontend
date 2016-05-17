import React, { Component } from 'react';
import Chip from './Chip';
import TextField from 'material-ui/TextField';
import theme from '../../theme'

const styles = {
  wrapper: {
    paddingTop: '40px',
    paddingBottom: '10px',
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
    margin: '0 0 0 10px',
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
    margin: '0 0 0 10px',
  },
  input: {
    marginLeft: '5px',
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
    this.onInputFocus = this.onInputFocus.bind(this);
    this.onInputBlur = this.onInputBlur.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);

    this.state = {
      items: this.props.items,
      inputValue: '',
      inFocus: false
    };
  }

  onChipsChange(){
    this.props.onChange(this.state.items, this.props['data-path']);
  }

  addItem(){
    let value = this.state.inputValue;
    if(value.length > 0){
      let newItems = this.state.items.slice();
      newItems.push(value);
      this.setState({
        items: newItems,
        inputValue : '',
      }, this.onChipsChange);
    }
  }

  removeItem(index){
    if(Number.isInteger(index)){
      let newItems = this.state.items.slice();
      newItems.splice(index, 1);
      this.setState({
        items: newItems,
      }, this.onChipsChange);
    }
  }

  onRremoveItem(e){
    this.removeItem(e.currentTarget.value);
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
    this.addItem(e);
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

  render() {
    const {label} = this.props;
    let chips = this.state.items.map((item, index) =>
      <Chip value={item} index={index} onRemoveClick={this.onRremoveItem} key={index}/>
    );
    return (
      <div style={styles.wrapper}>
      <label for="newChips" style={this.state.inFocus ? styles.labelFocus : styles.label}>{label}</label>
          {chips}
          <TextField
            name="newChips"
            value={this.state.inputValue}
            onBlur={this.onInputBlur}
            onFocus={this.onInputFocus}
            onKeyPress={this.onKeyPress}
            onChange={this.onInputChange}
            hintText="Add new"
            style={styles.input}
          />
      </div>
    );
  }
}

Chips.defaultProps = {
  onChange: () => {},
  items: [],
  label: 'Chips',
  'data-path' : '',
};
