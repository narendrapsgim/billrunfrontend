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
    let { value, onChange, path, label, errorText = '', errorStyle = {} } = this.props;

    if (value == 'undefined'){
      return null;
    }

    if(value == 'multipleValues') {
      value = null;
      errorText = 'Field contains multiple values';
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
