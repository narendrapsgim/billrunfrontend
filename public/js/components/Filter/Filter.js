import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import _ from 'lodash';

export default class Filter extends Component {
  constructor(props) {
    super(props);

    this.onChangeFilterField = this.onChangeFilterField.bind(this);
    this.onClickFilterBtn = _.debounce(this.onClickFilterBtn.bind(this), 700);
    this.buildQueryString = this.buildQueryString.bind(this);
    this.filterCond = this.filterCond.bind(this);
    this.onClickClear = this.onClickClear.bind(this);

    this.state = {
      filters: {},
    };
  }

  componentWillMount() {
    if (this.props.base) {
      this.setState({filters: this.props.base}, () => { this.onClickFilterBtn() });
    }
  }
  
  onChangeFilterField(e) {
    const { id, value } = e.target;
    this.setState({filters: {...this.state.filters, [id]: value}}, () => { this.onClickFilterBtn() });
  }

  filterCond(field, value) {
    const { fields } = this.props;
    let found = _.find(fields, (f) => { return f.id === field; });
    switch (found.type) {
      case "number":
        return parseInt(value, 10);
      case "text":
      default:
        return {"$regex": value, "$options": "i"};
    }
  }
  
  buildQueryString() {
    const filterObj = _.reduce(this.state.filters, (acc, value, field) => {
      if (!value) {
        return _.omit(acc, field);
      }
      return Object.assign({}, acc, {
        [field]: this.filterCond(field, value)
      })
    }, {});
    return JSON.stringify(filterObj);
  }
  
  onClickFilterBtn() {
    const { onFilter } = this.props;
    const filter = this.buildQueryString();
    console.log(filter);
    onFilter(filter);
  }

  onClickClear() {
    this.setState({filters: {}},
                  () => { this.onClickFilterBtn() });
  }

  render() {
    const { fields = [] } = this.props;
    const inputs = fields.map((field, key) => (
      <div className="col-md-2" key={key}>
        <input id={field.id}
               type={field.type || "text"}
               placeholder={field.placeholder}
               onChange={this.onChangeFilterField}
               value={this.state.filters[field.id] || ''}
               className="form-control" />
      </div>
    ));

    return (
      <div className="Filter">
          { inputs }
          {/* <div className="col-md-1">
          <RaisedButton primary={true} label="Filter" onMouseUp={this.onClickFilterBtn} style={{marginTop: 5}} />
          </div>
          <div className="col-md-1">
          <RaisedButton label="Clear" onMouseUp={this.onClickClear} style={{marginTop: 5}} />
          </div> */}
      </div>
    );
  }
}
