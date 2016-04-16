import React, { Component, PropTypes } from 'react';
import DatePicker from 'material-ui/lib/date-picker/date-picker';

class Field extends Component {
  constructor(props) {
    super(props);
  }
  
  createInputTag(field = {}) {
    let { label = <span dangerouslySetInnerHTML={{__html: '&zwnj;'}}></span>,
	  type,
          dbkey,
          multiselect = false,
          mandatory = false,
          size = 10 } = field;
    let html_id = dbkey ? dbkey : label.toLowerCase().replace(/ /g, '_');
    let { value, onChange } = this.props;
    
    if (type === "select") {
      let select_options = this.props.field.options;
      let options;
      if (!select_options) {
        options = [<option></option>];
      } else {
        options = select_options.map((op, key) => {
          return (
            <option value={value} key={key}>{op.label}</option>
          );
        });
      }
      return (
        <div className={`col-md-${size}`}>
          <label htmlFor={html_id}>{ mandatory ? `*${label}` : label}</label>
          <select className="form-control" id={html_id} value={value} onChange={onChange} multiple={multiselect}>
            {options}
          </select>
        </div>
      );
    } else if (type === "textarea") {
      return (
        <div className={`col-md-${size}`}>
          <label htmlFor={html_id}>{ mandatory ? `*${label}` : label}</label>
          <textarea className="form-control" id={html_id} value={value} onChange={onChange}></textarea>
        </div>
      );
    } else if (type === "date") {
      return (
        <div className={`col-md-${size}`}>
          <label htmlFor={html_id}>{label}</label>
          <DatePicker hintText={dbkey} id={html_id} onChange={onChange} />
        </div>
      );
    }

    return (
      <div className={`col-md-${size}`}>
        <label htmlFor={html_id}>{ mandatory ? `*${label}` : label}</label>
        <input type={type} className="form-control" id={html_id} value={value} onChange={onChange} />
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
