import React, { Component, PropTypes } from 'react';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import TextField from 'material-ui/lib/text-field';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';

class Field extends Component {
  constructor(props) {
    super(props);
    /* this.getOptions = this.getOptions.bind(this); */
  }
  /* 
     getOptions(path) {
     let arr = _.result(this.props, path);
     if (!arr) return [];
     return arr.map(elm => {
     return {value: elm, label: elm};
     });
     } */
  
  createInputTag(field = {}) {
    let { value, onChange, path } = this.props;
    let { label = <span dangerouslySetInnerHTML={{__html: '&zwnj;'}}></span>,
	  type = (typeof value),
          dbkey,
          multiselect = false,
          mandatory = false,
          size = 5 } = field;
    let html_id = dbkey ? dbkey : label.toLowerCase().replace(/ /g, '_');
    let inputLabel = mandatory ? `${label}*` : label;

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
        <div className={`col-md-${size}`}>
          <SelectField
              value={value}
              id={html_id}
              
              onChange={onChange} 
              floatingLabelText={inputLabel}>
            {options}
          </SelectField>
        </div>
      );
    } else if (type === "textarea") {
      return (
        <div className={`col-md-${size}`}>
          <label htmlFor={html_id}>{ mandatory ? `*${label}` : label}</label>
          <textarea className="form-control" id={html_id} value={value} data-path={path} onChange={onChange}></textarea>
        </div>
      );
    } else if (type === "date") {
      return (
        <div className={`col-md-${size}`}>
          <label htmlFor={html_id}>{label}</label>
          <DatePicker hintText={dbkey} id={html_id} data-path={path} onChange={onChange} />
        </div>
      );
    } else if (type === "array") {
      let options = value.prefix.map((prefix, key) => {
        return (
          <option value={prefix} key={key}>{prefix}</option>
        );
      });

      return (
        <div className={`col-md-${size}`}>
          <label htmlFor={html_id}>{value.region}</label>
          <select className="form-control" tags={value.prefix} data-path={path} onChange={onChange} multiple="true">
            {options}
          </select>
        </div>
      );
    }

    return (
      <div className={`col-md-${size}`}>
        <TextField value={value}
                   data-path={path}
                   onChange={onChange}
                   id={html_id}
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
