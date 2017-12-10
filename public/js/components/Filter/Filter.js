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

    this.state = {
      string: "",
      filter_by: [],
    };
  }

  componentDidMount() {
    this.onClickFilterBtn();
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
    const { string, filter_by } = this.state;
    const { base } = this.props;
    const baseObj = _.reduce(base, (acc, value, field) => {
      return Object.assign({}, acc, {
        [field]: this.filterCond(field, value)
      });
    }, {});

    if (!string.replace(/\s/gi, '')) return baseObj;

    const filterObj = _.reduce(filter_by, (acc, field) => {
      return Object.assign({}, acc, {
        [field]: this.filterCond(field, string)
      });
    }, baseObj);
    return filterObj;
  }

  onClickFilterBtn() {
    const { onFilter } = this.props;
    const filter = this.buildQueryString();
    onFilter(filter);
  }

  onClearFilter = () => {
    this.setState({filter_by: [], string: ''}, () => {
      this.onClickFilterBtn();
    });
  };

  onSelectFilterField(option, checked) {
    const value = option.val();
    const { filter_by } = this.state;
    const included = _.includes(filter_by, value);
    if (checked && included) return;
    if (!checked && included) return this.setState({filter_by: _.without(filter_by, value)});
    return this.setState({filter_by: filter_by.concat(value)});
  }

  render() {
    const { fields = [] } = this.props;
    const { filter_by, string } = this.state;

    const fields_options = fields
      .filter(field => field.showFilter !== false)
      .map((field, key) => {
        let selected = _.includes(filter_by, field.id);
        return {value: field.id, label: field.placeholder, selected };
      });

    return (
      <div className="Filter row" style={{marginBottom: 10}}>
        <div className="filter-warp">
          <div className="pull-left">
            <input id="filter-string"
                   placeholder="Search for..."
                   onChange={ this.onChangeFilterString }
		   value={ string }
                   className="form-control"/>
          </div>
          <div className="pull-left">
            <Multiselect data={fields_options}
                         multiple
                         onChange={this.onSelectFilterField}
                         buttonWidth="100%"
                         nonSelectedText="Search in fields"
            />
          </div>
          <div className="search-button pull-left">
            <button className="btn btn-default search-btn"
                    onClick={this.onClickFilterBtn}
                    type="submit"
                    disabled={(string && filter_by.length === 0) || (!string && filter_by.length === 0)}>
              <i className="fa fa-search"></i>
            </button>
          </div>
          <div className="search-button pull-left">
            <button className="btn btn-default search-btn"
                    onClick={this.onClearFilter}
                    type="button">
              <i className="fa fa-eraser"></i>
            </button>
	  </div>
        </div>
      </div>
    );
  }
}
