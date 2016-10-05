import React, { Component } from 'react';
import { connect } from 'react-redux';

import { addUsagetMapping } from '../../actions/inputProcessorActions';
import { Table } from 'react-bootstrap/lib';
import FontIcon from 'material-ui/FontIcon';
import Select from 'react-select';

export default class FieldsMapping extends Component {
  constructor(props) {
    super (props);

    this.onChangePattern = this.onChangePattern.bind(this);
    this.onChangeUsaget  = this.onChangeUsaget.bind(this);
    this.addUsagetMapping = this.addUsagetMapping.bind(this);
    this.onChangeUsaget = this.onChangeUsaget.bind(this);
    this.onSetType = this.onSetType.bind(this);
    this.onChangeStaticUsaget = this.onChangeStaticUsaget.bind(this);

    this.state = {
      pattern: "",
      usaget: "",
      separateTime: false
    };
  }

  componentWillMount() {
    if (this.props.settings.getIn(['processor', 'time_field'])) {
      this.setState({separateTime: true});
    }
  }
  
  onChangePattern(e) {
    this.setState({pattern: e.target.value});    
  }

  onChangeUsaget(val) {
    const { usageTypes } = this.props;

    const found = usageTypes.find(usaget => {
      return usaget === val;
    });
    if (!found) {
      this.props.addUsagetMapping(val);
    }

    this.setState({usaget: val});
  }

  onChangeStaticUsaget(usaget) {
    this.onChangeUsaget(usaget);
    this.props.onSetStaticUsaget.call(this, usaget);
  }
  
  addUsagetMapping(e) {
    const { usaget, pattern } = this.state;
    const { onError } = this.props;
    if (!this.props.settings.getIn(['processor', 'src_field'])) {
      onError("Please select usage type field");
      return;
    }
    if (!usaget || !pattern){
      onError("Please input a value and unit type");
      return;
    }
    if (pattern.match(/[^a-zA-Z0-9_]/g)) {
      onError("Only alphanumeric and underscore characters are allowed");
      return;
    }
    this.props.onAddUsagetMapping.call(this, {usaget, pattern});
    this.setState({pattern: "", usaget: ""});
  }

  removeUsagetMapping(index, e) {
    this.props.onRemoveUsagetMapping.call(this, index);
  }

  onSetType(e) {
    const { value } = e.target;
    this.props.setUsagetType(value);
  }

  onChangeSeparateTime = (e) => {
    const { checked } = e.target;
    if (!checked) this.props.unsetField(['processor', 'time_field']);
    this.setState({separateTime: !this.state.separateTime});
  };
  
  render() {
    const { settings,
            usageTypes,
            onSetFieldMapping } = this.props;

    const available_fields = [(<option disabled value="" key={-1}>Select Field</option>),
                              ...settings.get('fields', []).map((field, key) => (
                                <option value={field} key={key}>{field}</option>
                              ))];
    const available_units = usageTypes.map((usaget, key) => {
      return {value: usaget, label: usaget};
    }).toJS();

    return (
      <form className="form-horizontal FieldsMapping">
        <div className="form-group">
          <div className="col-lg-3">
            <label htmlFor="date_field">Date</label>
            <p className="help-block">Date of record creation</p>
          </div>
          <div className="col-lg-9">
            <div className="col-lg-1" style={{marginTop: 8}}>
              <i className="fa fa-long-arrow-right"></i>
            </div>
            <div className="col-lg-9">
              <select id="date_field"
                      className="form-control"
                      onChange={onSetFieldMapping}
                      value={settings.getIn(['processor', 'date_field'], '')}>
                { available_fields }
              </select>
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="col-lg-offset-3 col-lg-9">
            <div className="col-lg-offset-1 col-lg-9">
              <div className="input-group">
                <div className="input-group-addon">
                  <input type="checkbox"
                         checked={this.state.separateTime}
                         onChange={this.onChangeSeparateTime}
                  />
                  Time in separate field
                </div>
                <select id="time_field"
                        className="form-control"
                        onChange={onSetFieldMapping}
                        disabled={!this.state.separateTime}
                        value={settings.getIn(['processor', 'time_field'], '')}>
                  { available_fields }
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="separator" />
        <div className="form-group">
          <div className="col-lg-3">
            <label htmlFor="volume_field">Volume</label>
            <p className="help-block">Amount calculated</p>
          </div>
          <div className="col-lg-9">
            <div className="col-lg-1" style={{marginTop: 8}}>
              <i className="fa fa-long-arrow-right"></i>
            </div>
            <div className="col-lg-9">
              <select id="volume_field"
                      className="form-control"
                      onChange={onSetFieldMapping}
                      value={settings.getIn(['processor', 'volume_field'], '')}>
                { available_fields }
              </select>
            </div>
          </div>
        </div>
        <div className="separator" />
        <div className="form-group">
          <div className="col-lg-2">
            <label>Usage types</label>
            <p className="help-block">Types of usages</p>
          </div>
          <div className="col-lg-1">
            <label><input type="radio"
                          name="usage_types_type"
                          value="static"
                          checked={settings.get('usaget_type', '') === "static"}
                          onChange={this.onSetType} />
              Static
            </label>
          </div>
          <div className="col-lg-9">
            <div className="col-lg-1" style={{marginTop: 8}}>
              <i className="fa fa-long-arrow-right"></i>
            </div>
            <div className="col-lg-9">            
              <Select
                  id="unit"
                  options={available_units}
                  allowCreate={true}
                  value={settings.getIn(['processor', 'default_usaget'], '')}
                  disabled={settings.get('usaget_type', '') !== "static"}
                  style={{marginTop: 3}}
                  onChange={this.onChangeStaticUsaget}
              />
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="col-lg-offset-2 col-lg-1">
            <label><input type="radio"
                          name="usage_types_type"
                          value="dynamic"
                          checked={settings.get('usaget_type', '') === "dynamic"}
                          onChange={this.onSetType} />
              Dynamic
            </label>
          </div>
          <div className="col-lg-9">
            <div className="col-lg-1" style={{marginTop: 8}}>
              <i className="fa fa-long-arrow-right"></i>
            </div>
            <div className="col-lg-9">
              <select id="src_field"
                      className="form-control"
                      onChange={onSetFieldMapping}
                      value={settings.getIn(['processor', 'src_field'], '')}
                      disabled={settings.get('usaget_type', '') !== "dynamic"}>
                { available_fields }
              </select>
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="col-lg-offset-3 col-lg-7">
            <div className="col-lg-offset-1 col-lg-10">
              <div className="col-lg-5">
                <strong>Input Value</strong>
              </div>
              <div className="col-lg-5">
                <strong>Usage Type</strong>
              </div>
            </div>
          </div>
        </div>
            {
              settings.getIn(['processor', 'usaget_mapping'], []).map((usage_t, key) => (
                <div className="form-group" key={key}>
                  <div className="col-lg-offset-3 col-lg-7">
                    <div className="col-lg-offset-1 col-lg-10">
                      <div className="col-lg-5">{usage_t.get('pattern', '')}</div>
                      <div className="col-lg-5">{usage_t.get('usaget', '')}</div>
                      <div className="col-lg-2">
                        <button type="button"
                                className="btn btn-danger btn-circle"
                                disabled={settings.get('usaget_type', '') !== "dynamic"}                                
                                onClick={this.removeUsagetMapping.bind(this, key)}>
                          <i className="fa fa-minus" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            }
        <div className="form-group">
          <div className="col-lg-offset-3 col-lg-7">
            <div className="col-lg-offset-1 col-lg-10">
              <div className="col-lg-5">
                <input className="form-control"
                       onChange={this.onChangePattern}
                       disabled={settings.get('usaget_type', '') !== "dynamic"}                   
                       value={this.state.pattern} />
              </div>
              <div className="col-lg-5">
                <Select
                    id="unit"
                    options={available_units}
                    allowCreate={true}
                    value={this.state.usaget}
                    style={{marginTop: 3}}
                    disabled={settings.get('usaget_type', '') !== "dynamic"}
                    onChange={this.onChangeUsaget}
                />
              </div>
              <div className="col-lg-2">
                <button type="button"
                        className="btn btn-info btn-circle"
                        disabled={settings.get('usaget_type', '') !== "dynamic"}
                        onClick={this.addUsagetMapping}>
                  <i className="fa fa-plus"/>
                </button>                
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
}
