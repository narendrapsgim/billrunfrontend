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
    } else if (type === "date") {
      return (
        <div className={`col-md-${size}`}>
          <label htmlFor={html_id}>{label}</label>
          <DatePicker hintText={dbkey} id={html_id} data-path={path} onChange={onChange} />
        </div>
      );
    } else if (type === "array") {
      let { title, items } = field.array;
      let options = value[items].map((item, key) => {
        return (
          <option value={item} key={key}>{item}</option>
        );
      });

      return (
        <div className={`col-md-${size}`}>
          <label htmlFor={html_id}>{value[title]}</label>
          <select className="form-control" value={value[items]} data-path={`${path}.${items}`} onChange={onChange} multiple="true">
            {options}
          </select>
        </div>
      );
    }

    let multiLine = type === "textarea" ? true : false;
    let rows = multiLine ? 2 : 1;
    return (
      <div className={`col-md-${size}`}>
        <TextField value={value}
                   data-path={path}
                   onChange={onChange}
                   id={html_id}
                   multiLine={multiLine}
                   rows={rows}
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
