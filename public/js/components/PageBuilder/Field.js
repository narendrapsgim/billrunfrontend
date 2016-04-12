import React, { Component, PropTypes } from 'react';

class Field extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { label = <span dangerouslySetInnerHTML={{__html: '&zwnj;'}}></span>,
          type,
          dbkey,
          mandatory = false,
          size } = this.props.field;

    if (type === "select") {
      let options = this.props.field.options.map((op, key) => {
        return (
          <option value={op.value} key={key}>{op.label}</option>
        );
      });

      return (
        <div className={`col-md-${size}`}>
          <label htmlFor={dbkey}>{ mandatory ? `*${label}` : label}</label>
          <select className="form-control" id={dbkey}>
            {options}
          </select>
        </div>
      );
    } else if (type === "textarea") {
      return (
        <div className={`col-md-${size}`}>
          <label htmlFor={dbkey}>{ mandatory ? `*${label}` : label}</label>
          <textarea className="form-control" id={dbkey}></textarea>
        </div>
      );
    }

    return (
      <div className={`col-md-${size}`}>
        <label htmlFor={dbkey}>{ mandatory ? `*${label}` : label}</label>
        <input type={type} className="form-control" id={dbkey} />
      </div>
    );
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
