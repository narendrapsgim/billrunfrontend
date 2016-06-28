import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import ops from './filterOperations'

export default class AdvancedFilter extends React.Component {

  constructor(props) {
    super(props);

    this.styles = {
      select: { margin: '10px', height: '50px', verticalAlign: 'bottom' },
      input: { margin: '10px' }
    }

    this.getOperators = this.getOperators.bind(this);
    this.getOperator = this.getOperator.bind(this);

    this.getInput = this.getInput.bind(this);
    this.getField = this.getField.bind(this);

    this.handleOparetorChange = this.handleOparetorChange.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleInputValueChange = this.handleInputValueChange.bind(this);
    this.handleSelectValueChange = this.handleSelectValueChange.bind(this);

    this.getSelectedField = this.getSelectedField.bind(this);
    this.getSelectedOp = this.getSelectedOp.bind(this);
    this.updateParrent = this.updateParrent.bind(this);

    this.state = {
      op: null,
      field: null,
      value: '',
    };
  }

  handleOparetorChange(e, index, key) {
    this.setState({op: key});
  }

  handleFieldChange(e, index, key) {
    this.setState({field: key, op: null, value: ''});
  }

  handleInputValueChange(e, value) {
    this.setState({value}, this.updateParrent);

  }

  updateParrent(){
    if(this.props.onFilterChanged){
      let data = Object.assign({}, this.state, {index: this.props.index});
      this.props.onFilterChanged(data);
    }
  }

  handleSelectValueChange(e, index, value) {
    this.setState({value});
  }

  getOperator() {
    let selectedOp = this.getSelectedOp();
    return (
      <SelectField disabled={!this.state.field} maxHeight={300} value={this.state.op} onChange={this.handleOparetorChange} hintText="Select Oparetor..." style={this.styles.select} errorText={selectedOp && selectedOp.description} errorStyle={{color: 'orange'}}>
        {this.getOperators()}
      </SelectField>
    );
  }

  getSelectedField(){
    return this.props.fields.find((field, index) => field.key === this.state.field );
  }

  getSelectedOp(){
    let selectedFiled = this.getSelectedField();
    if(selectedFiled){
      return selectedFiled.operators.find((op, index) => op.key === this.state.op );
    }
    return null;
  }

  getOperators() {
    let opFiled = this.getSelectedField();
    if(opFiled && opFiled.operators){
      return (opFiled.operators.map((item, index) => <MenuItem value={item.key} key={index} primaryText={item.value}/>));
    }
    return null;
  }

  getInput() {
    let opFiled = this.getSelectedField();
    if(opFiled && opFiled.options && Array.isArray(opFiled.options)){
      return (
        <SelectField disabled={!this.state.field || !this.state.op} maxHeight={300} value={this.state.value} onChange={this.handleSelectValueChange} hintText="Select value..." style={this.styles.select}>
          {opFiled.options.map((item, index) => <MenuItem value={item} key={index} primaryText={item}/>)}
        </SelectField>
      );
    }
    return (<TextField disabled={!this.state.field || !this.state.op} hintText="Enter value..." value={this.state.value} onChange={this.handleInputValueChange} style={this.styles.input}/>);
  }

  getField() {
    return (
      <SelectField maxHeight={300} value={this.state.field} onChange={this.handleFieldChange} hintText="Select field..." style={this.styles.select}>
        {this.getFields()}
      </SelectField>
    );
  }

  getFields() {
    return (this.props.fields.map((item, index) => <MenuItem value={item.key} key={index} primaryText={item.value}/>));
  }

  render() {
    return (
      <div>
        {this.getField()}
        {this.getOperator()}
        {this.getInput()}
      </div>
    );
  }
}
