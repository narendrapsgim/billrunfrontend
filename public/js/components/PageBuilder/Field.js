import React, { Component, PropTypes } from 'react';
import DatePicker from 'material-ui/lib/date-picker/date-picker';

class Field extends Component {
  constructor(props) {
    super(props);
  }

  createInputTag(field) {
    let { label = <span dangerouslySetInnerHTML={{__html: '&zwnj;'}}></span>,
          type,
          dbkey,
          mandatory = false,
          size = 10 } = field;

    let html_id = dbkey ? dbkey : label.toLowerCase().replace(/ /g, '_');

    if (type === "select") {
      let options = this.props.field.options.map((op, key) => {
        return (
          <option value={op.value} key={key}>{op.label}</option>
        );
      });

      return (
        <div className={`col-md-${size}`}>
          <label htmlFor={html_id}>{ mandatory ? `*${label}` : label}</label>
          <select className="form-control" id={html_id} onChange={this.props.onChange}>
            {options}
          </select>
        </div>
      );
    } else if (type === "textarea") {
      return (
        <div className={`col-md-${size}`}>
          <label htmlFor={html_id}>{ mandatory ? `*${label}` : label}</label>
          <textarea className="form-control" id={html_id} onChange={this.props.onChange}></textarea>
        </div>
      );
    } else if (type === "date") {
      return (
        <div className={`col-md-${size}`}>
          <label htmlFor={html_id}>{label}</label>
          <DatePicker hintText={dbkey} id={html_id} onChange={this.props.onChange} />
        </div>
      );
    }

    return (
      <div className={`col-md-${size}`}>
        <label htmlFor={html_id}>{ mandatory ? `*${label}` : label}</label>
        <input type={type} className="form-control" id={html_id} onChange={this.props.onChange} />
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
  })
};

export default Field;
