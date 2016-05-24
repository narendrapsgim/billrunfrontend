import React, { Component, PropTypes } from 'react';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import Checkbox from 'material-ui/Checkbox';
import Toggle from 'material-ui/Toggle';
import MenuItem from 'material-ui/MenuItem';
import moment from 'moment';

import Chips from '../Chips';
import globalSetting from '../../globalSetting';

class Field extends Component {
  constructor(props) {
    super(props);
    this.state = { path: "" };
    this.onTagsChange = this.onTagsChange.bind(this);
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
    let value = val.toISOString()
    let evt = {
      target: { dataset: { path: path } }
    };
    this.props.onChange(evt, 0, value);
  }

  createInputTag(field = {}) {
    let { value, onChange, path } = this.props;

    if (value == 'undefined'){
      return null;
    }

    let { label = <span dangerouslySetInnerHTML={{__html: '&zwnj;'}}></span>,
	  type = (typeof value),
          dbkey,
          multiselect = false,
          mandatory = false,
          inline = false,
          crud = "0110",
          size = 5 } = field;

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
        <div>
          <SelectField
              value={value}
              id={html_id}
              onChange={onChange}
              floatingLabelText={inputLabel}
              disabled={disabled}
          >
            {options}
          </SelectField>
        </div>
      );
    } else if (type === "date") {
      let datePicker = null;
      if (value && value.sec) {
        datePicker = <DatePicker hintText={dbkey} id={html_id} data-path={path} onChange={this.onDateChange.bind(null, path)} defaultDate={new Date(value.sec*1000)} formatDate={this.formatDate} disabled={disabled} />
      } else {
        datePicker = <DatePicker hintText={dbkey} id={html_id} data-path={path} onChange={this.onDateChange.bind(null, path)} formatDate={this.formatDate} disabled={disabled} />
      }
      return (
        <div>
          <label htmlFor={html_id}>{label}</label>
          {datePicker}
        </div>
      );
    } else if (type === "array") {
      return (
        <div>
          <Chips items={value} onChange={this.onTagsChange} label={label} data-path={path} disabled={disabled} />
        </div>
      );
    } else if (type === "checkbox") {
      return (
        <div>
          <Checkbox
              data-path={path}
              label={inputLabel}
              style={{ marginBottom: '16px', marginLeft: '-2px', marginTop: '5px'}}
              defaultChecked={value}
              disabled={disabled}
              onCheck={onChange}
          />
        </div>
      );
    } else if (type === "toggle") {
      return (
        <div>
          <Toggle
            label={inputLabel}
            data-path={path}
            defaultToggled={value}
            onToggle={onChange}
          />
        </div>
      );
    }

    let multiLine = type === "textarea" ? true : false;
    let rows = multiLine ? 2 : 1;
    return (
      <div>
        <TextField value={value}
                   data-path={path}
                   onChange={onChange}
                   id={html_id}
                   fullWidth={true}
                   multiLine={multiLine}
                   rows={rows}
                   disabled={disabled}
                   floatingLabelText={inputLabel}
        />
      </div>
    );
  }

  render() {
    return this.createInputTag(this.props.field);
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
