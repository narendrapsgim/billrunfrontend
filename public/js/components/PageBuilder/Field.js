import React, { Component, PropTypes } from 'react';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';
import * as Colors from 'material-ui/styles/colors'
import SelectField from 'material-ui/SelectField';
import Checkbox from 'material-ui/Checkbox';
import Toggle from 'material-ui/Toggle';
import MenuItem from 'material-ui/MenuItem';
import moment from 'moment';

import Chips from '../Chips';

class Field extends Component {
  constructor(props) {
    super(props);
    this.state = { path: "" };
    this.onTagsChange = this.onTagsChange.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.formatDate = this.formatDate.bind(this);
  }

  formatDate(date){
    return (moment(date).format(globalSetting.dateFormat)) ;
  }

  onTagsChange(val, path) {
    let evt = {
      target: { dataset: { path: path } }
    };
    this.props.onChange(evt, 0, val);
  }

  onDateChange(path, nullEvent, val) {
    let value = moment(val).format("YYYY-MM-DDTHH:mm:ss") + ".000Z";
    let evt = {
      target: { dataset: { path: path } }
    };
    this.props.onChange(evt, 0, value);
  }

  onSelectChange(path, e, index, value) {
    let evt = {
      target: { dataset: { path: path } }
    };
    this.props.onChange(evt, index, value);
  }

  createInputTag(field = {}) {
    let { value, onChange, path, label } = this.props;

    if (value == 'undefined'){
      return null;
    }

    let errorText = '';
    let errorStyle = {};
    if(value == 'mixed') {
      value = null;
      errorText = 'This field contain mixed data';
      errorStyle = { color: Colors.orange500 };
    }


    let { type = (typeof value),
          dbkey,
          multiselect = false,
          mandatory = false,
          inline = false,
          crud = "0110",
        } = field;

    if (crud[1] === "0") return (null);
    let disabled = crud[2] === "0";
    let html_id = dbkey ? dbkey : label.toLowerCase().replace(/ /g, '_');
    let inputLabel = mandatory ? <span>{label} <span className="required">*</span></span> : label;

    if (type === "select") {
      let select_options = this.props.field.options;
      let options;
      if (!select_options) {
        options = [<option></option>];
      } else {
        options = select_options.map((op, key) => {
          return (
            <MenuItem path={path} value={op.value} key={key} primaryText={op.label} />
          );
        });
      }
      return (
        <SelectField  value={value}
                      id={html_id}
                      onChange={this.onSelectChange.bind(null, path)}
                      floatingLabelText={inputLabel}
                      disabled={disabled}
                      fullWidth={true}
        >
          {options}
        </SelectField>
      );
    } else if (type === "date") {
      let datePicker = null;
      if (value && value.sec) {
        datePicker = <DatePicker fullWidth={true} errorText={errorText} errorStyle={errorStyle} floatingLabelText={label} autoOk={true} hintText={dbkey} id={html_id} data-path={path} onChange={this.onDateChange.bind(null, path)} defaultDate={new Date(value.sec*1000)} formatDate={this.formatDate} disabled={disabled} />
      } else {
        datePicker = <DatePicker fullWidth={true} errorText={errorText} errorStyle={errorStyle} floatingLabelText={label} autoOk={true} hintText={dbkey} id={html_id} data-path={path} onChange={this.onDateChange.bind(null, path)} formatDate={this.formatDate} disabled={disabled} />
      }
      return datePicker;
    } else if (type === "array") {
      return (
          <Chips  items={value}
                  onChange={this.onTagsChange}
                  label={label}
                  data-path={path}
                  disabled={disabled}
                  errorText={errorText}
                  errorStyle={errorStyle}
          />
      );
    } else if (type === "checkbox") {
      return (
        <Checkbox data-path={path}
                  label={inputLabel}
                  defaultChecked={value}
                  disabled={disabled}
                  onCheck={onChange}
                  fullWidth={true}
                  style={{ height: '40px', marginLeft: '-2px', marginTop: '30px' }}
        />
      );
    } else if (type === "toggle") {
      return (
        <Toggle label={inputLabel}
                data-path={path}
                defaultToggled={value}
                onToggle={onChange}
                fullWidth={true}
                style={{height: '30px', marginTop: '30px'}}
        />
      );
    }

    let multiLine = type === "textarea" ? true : false;
    let rows = multiLine ? 2 : 1;
    value = (typeof value === undefined || value === null) ? '' : value;
    return (
      <TextField value={value}
                 data-path={path}
                 onChange={onChange}
                 id={html_id}
                 fullWidth={true}
                 multiLine={multiLine}
                 rows={rows}
                 errorText={errorText}
                 errorStyle={errorStyle}
                 disabled={disabled}
                 floatingLabelText={inputLabel}
      />
    );
  }

  render() {
    const {size = 12} = this.props;
    return <div className={`col-md-${size}`}>{this.createInputTag(this.props.field)}</div>;
  }
};

Field.propTypes = {
  field: PropTypes.shape({
    dbkey: (props, propName, componentName) => {
      if (!props[propName] && !props['label']) {
        return new Error("Must supply either 'dbkey' or 'label' in field");
      }
    }
  }),
  onChange: PropTypes.func.isRequired
};

export default Field;



window.isArrayOfObjects = function(element){
  var result = Array.isArray(element);
  if(!result) return false;

  result = element.length > 0;
  if(!result) return false;

  result = Object.prototype.toString.call(element[0]) === "[object Object]";
  if(!result) return false;
  return true;
}

window.parsePrefix = function(items, block, key = '', parent = {}){
  var html = "<div class='prefix'>";
  // console.log("key: ", key);
  // console.log("parent: ", parent);
  // console.log("block: ", block);
  var all = items.map((item, i) => _.get(item, key));
  var intersected = _.intersectionBy(...all, 'region');
  intersected.forEach( (value) => {
    html +=  value.region + ":" + '<input type="text" name="lname" value="' + value.prefix.join() + '"><br>';
  });
  html += "</div>";
  return html;
}

window.parseValue = function(items, block, key = '', parent = {}){

  //console.log("parent : ", parent ," key: ", key);

  var dbkey  = (key.length) ? key + "." + block.dbkey : block.dbkey;
  var values = items.map( (item, i) => {
    var val = _.get(item, dbkey, '');
    if(_.isArray(val)){
      val = val.join();
    } else if(typeof val.sec !== 'undefined'){
      val = new Date(val.sec * 1000);
    }
    return val;
  });
  var mergedValue = values.reduce( (prevValue, currentValue, index) => {
    return (prevValue == currentValue) ? currentValue : 'mixed';
  })
  return  block.label + ":" + '<input type="text" name="lname" value="' + mergedValue + '"><br>';
}

window.parseRaw = function(items, block, key ='', parent = {}){
  var html = "<div class='raw'>";
  if(parent.type == 'prefix'){
    html += parsePrefix(items, block.row, key, parent);
  } else {
    block.row.map((row, i) => {
       html += parseData(items, row, key, parent);
    });
  }
  html += "</div>";
  return html;
}

window.parseFields = function(items, block, key ='', parent={}){
  var html = '';
  block.fields.forEach((field, i) => {
    if(typeof block.dbkey !== 'undefined'){
      if(block.dbkey == "*"){
        var values = items.map( (item, i) => _.get(item, key, '') );
        var valuesKeys = values.map( (value, i) => Object.keys(value) );
        var intersectKeys = _.intersection(...valuesKeys);
        intersectKeys.forEach((objectKey, i) => {
          var dbkey = key + "." + objectKey;
          html += parseData(items, field, dbkey);
        });
      } else {
        if(parent.type == 'prefix'){
            console.log("key: ", key);
            console.log("parent: ", parent);
        }
        var dbkey = (key.length) ? key + "." +  block.dbkey : block.dbkey;
        var values = items.map( (item, i) => {return _.get(item, dbkey, '')} );
        var allValues = _.merge(...values);
        if(isArrayOfObjects(allValues) && !(block.type && block.type == 'prefix')){
          console.log("parent: ", block);

          html += "<ul>";
          allValues.forEach((val, i) => {
            var k = dbkey + '[' + i +']';
            html += "<li>" + parseData(items, field, k, block) + "</li>";
          });
          html += "</ul>";
        } else {
          html += parseData(items, field, dbkey, block);
        }
      }
    } else {
        html += parseData(items, field, key, block);
    }
  });
  return html;
}
window.parseData = function(items, block, key ='', parent = {}){
  var html = '';
  if(block.hasOwnProperty('fields')){
    html += parseFields(items, block, key, parent)
  } else if (block.hasOwnProperty('row')){
    html += parseRaw(items, block, key, parent);
  } else {
    html += parseValue(items, block, key, parent);
  }
  return html;
}
