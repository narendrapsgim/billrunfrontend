import React, { Component, PropTypes } from 'react';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import Checkbox from 'material-ui/Checkbox';
import Toggle from 'material-ui/Toggle';
import MenuItem from 'material-ui/MenuItem';
import TagsInput from 'react-tagsinput';

class Field extends Component {
  constructor(props) {
    super(props);
    this.state = { path: "" };
    this.onTagsChange = this.onTagsChange.bind(this);
  }

  onTagsChange(val) {
    let evt = {
      target: { dataset: { path: this.state.path } }
    };
    this.props.onChange(evt, 0, val);
  }

  /** HACKITY HACK!! **/
  componentDidMount() {
    if (this.props.field.type === "array") {
      let { path, field: { array: { items } } } = this.props;
      this.setState({path: `${path}.${items}`});
    }
  }

  createInputTag(field = {}) {
    let { value, onChange, path } = this.props;

    if (value == 'undefined'){
      return (<div></div>);
    }

    let { label = <span dangerouslySetInnerHTML={{__html: '&zwnj;'}}></span>,
	  type = (typeof value),
          dbkey,
          multiselect = false,
          mandatory = false,
          size = 5 } = field;
    let html_id = dbkey ? dbkey : label.toLowerCase().replace(/ /g, '_');
    let inputLabel = mandatory ? <span>label <span className="required">*</span></span> : label;

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
      return (
        <div className={`col-md-${size}`}>
          <label htmlFor={html_id}>{value[title]}</label>
          <TagsInput value={value[items]} onChange={this.onTagsChange} />
        </div>
      );
    } else if (type === "checkbox") {
      return (
        <div className={`col-md-${size}`}>
          <Checkbox
            data-path={path}
            label={inputLabel}
            style={{ marginBottom: '16px', marginLeft: '-10px'}}
            defaultChecked={value}
            onCheck={onChange}
          />
        </div>
      );
    } else if (type === "toggle") {
      return (
        <div className={`col-md-${size}`}>
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
      <div className={`col-md-${size}`}>
        <TextField value={value}
                   data-path={path}
                   onChange={onChange}
                   id={html_id}
                   fullWidth={true}
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
