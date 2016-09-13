import React, { Component } from 'react';
import _ from 'lodash';

/* COMPONENTS */
import Multiselect from 'react-bootstrap-multiselect';

export default class Filter extends Component {
  constructor(props) {
    super(props);

    this.onChangeFilterString = this.onChangeFilterString.bind(this);
    this.onSelectFilterField = this.onSelectFilterField.bind(this);
    this.onClickFilterBtn = this.onClickFilterBtn.bind(this);
    this.buildQueryString = this.buildQueryString.bind(this);
    this.filterCond = this.filterCond.bind(this);
    this.onClickClear = this.onClickClear.bind(this);

    this.state = {
      string: "",
      fields: [],
    };
  }

  componentDidMount() {
    if (this.props.base) {
      this.setState({filters: this.props.base}, () => { this.onClickFilterBtn() });
    }
  }

  onChangeFilterString(e) {
    const { value } = e.target;
    this.setState({string: value});
  }
  
  filterCond(field, value) {
    const { fields } = this.props;
    let found = _.find(fields, (f) => { return f.id === field; });
    if (!found) return {"$regex": value, "$options": "i"};
    switch (found.type) {
      case "number":
        return parseInt(value, 10);
      case "datetime":
        return value;
      case "text":
      default:
        return {"$regex": value, "$options": "i"};
    }
  }

  buildQueryString() {
    const { string, fields } = this.state;
    const filterObj = _.reduce(fields, (acc, field) => {
      return Object.assign({}, acc, {
        [field]: this.filterCond(field, string)
      });
    }, {});
    return JSON.stringify(filterObj);
  }

  onClickFilterBtn() {
    const { onFilter } = this.props;
    const filter = this.buildQueryString();
    onFilter(filter);
  }

  onClickClear() {
    this.setState({filters: {}},
                  () => { this.onClickFilterBtn() });
  }

  getFieldValue(field) {
    switch(field.type) {
      case "text":
      default:
        return this.state.filters[field.id] || '';
    }
  }

  onSelectFilterField(option, checked) {
    const value = option.val();
    const included = _.includes(this.state.fields, value);
    const { fields } = this.state;
    if (checked && included) return;
    if (!checked && included) return this.setState({fields: _.without(fields, value)});
    return this.setState({fields: fields.concat(value)});
  }
  
  render() {
    const { fields = [] } = this.props;

    const fields_options = fields.map((field, key) => {
      let selected = _.includes(this.state.fields, field.id);
      return {value: field.id, label: field.placeholder, selected };
    });

    return (
      <div className="Filter">
        <div className="col-lg-2">
          <input id="filter-string" onChange={this.onChangeFilterString} className="form-control" />
        </div>
        <div className="col-lg-2">
          <Multiselect data={fields_options} multiple onChange={this.onSelectFilterField} buttonWidth="100%" />
        </div>
        <div className="col-lg-1">
          <button className="btn btn-default" onClick={this.onClickFilterBtn}><i className="fa fa-search"></i></button>
        </div>
      </div>
    );
  }
}
