import React, { Component } from 'react';
import { connect } from 'react-redux';

import { addUsagetMapping } from '../../actions/inputProcessorActions';
import { Table } from 'react-bootstrap/lib';
import FontIcon from 'material-ui/FontIcon';
import * as Colors from 'material-ui/styles/colors'
import Select from 'react-select';

export default class FieldsMapping extends Component {
  constructor(props) {
    super (props);

    this.onChangePattern = this.onChangePattern.bind(this);
    this.onChangeUsaget  = this.onChangeUsaget.bind(this);
    this.addUsagetMapping = this.addUsagetMapping.bind(this);
    this.onChangeUsaget = this.onChangeUsaget.bind(this);

    this.state = {
      pattern: "",
      usaget: ""
    };
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
    this.props.onAddUsagetMapping.call(this, {usaget, pattern});
    this.setState({pattern: "", usaget: ""});
  }

  removeUsagetMapping(index, e) {
    this.props.onRemoveUsagetMapping.call(this, index);
  }
  
  render() {
    const { settings,
            usageTypes,
            onSetFieldMapping } = this.props;
    const available_fields = [(<option disabled value="-1" key={-1}>Select Field</option>),
                              ...settings.get('fields').map((field, key) => (
                                <option value={field} key={key}>{field}</option>
                              ))];
    const available_units = usageTypes.map((usaget, key) => {
      return {value: usaget, label: usaget};
    }).toJS();

    return (
      <form className="form-horizontal FieldsMapping">
        <div className="form-group">
          <div className="col-xs-2">
            <label>Time</label>
          </div>
          <div className="col-xs-2">
            <select id="date_field"
                    className="form-control"
                    onChange={onSetFieldMapping}
                    value={settings.getIn(['processor', 'date_field'])}
                    defaultValue="-1">
              { available_fields }
            </select>
            <p className="help-block">Time of record creation</p>
          </div>
        </div>
        <div className="form-group">
          <div className="col-xs-2">
            <label>Volume</label>
          </div>
          <div className="col-xs-2">
            <select id="volume_field"
                    className="form-control"
                    onChange={onSetFieldMapping}
                    value={settings.getIn(['processor', 'volume_field'])}
                    defaultValue="-1">
              { available_fields }
            </select>
            <p className="help-block">Amount calculated</p>
          </div>
        </div>
        <div className="form-group">
          <div className="col-xs-2">
            <label>Usage types</label>
          </div>
          <div className="col-xs-2">
            <select id="src_field"
                    className="form-control"
                    onChange={onSetFieldMapping}
                    value={settings.getIn(['processor', 'src_field'])}
                    defaultValue="-1">
              { available_fields }
            </select>
            <p className="help-block">Types of usages and units used for measuring usage</p>
          </div>
        </div>
        <div className="form-group">
          <div className="col-xs-2">
            <label>Usage type mappings</label>
          </div>
          <div className="col-xs-6">
            <div className="form-group">
              <div className="col-xs-2">
                <strong className="text-uppercase">Value</strong>
              </div>
              <div className="col-xs-2">
                <strong className="text-uppercase">Unit Type</strong>
              </div>
            </div>
            {
              settings.getIn(['processor', 'usaget_mapping']).map((usage_t, key) => (
                <div className="form-group" key={key}>
                  <div className="col-xs-2">{usage_t.get('pattern')}</div>
                  <div className="col-xs-2">{usage_t.get('usaget')}</div>
                  <div className="col-xs-2">
                    <FontIcon onClick={this.removeUsagetMapping.bind(this, key)} className="material-icons" style={{cursor: "pointer", color: Colors.red300, fontSize: '24px'}}>remove_circle_outline</FontIcon>
                  </div>
                </div>
              ))
            }
                <div className="form-group">
                  <div className="col-xs-2">
                    <input className="form-control" onChange={this.onChangePattern} value={this.state.pattern} />
                  </div>
                  <div className="col-xs-2">
                    <Select
                        id="unit"
                        options={available_units}
                        allowCreate={true}
                        value={this.state.usaget}
                        style={{marginTop: 3}}
                        onChange={this.onChangeUsaget}
                    />
                  </div>
                  <div className="col-xs-2">
                    <FontIcon onClick={this.addUsagetMapping} className="material-icons" style={{cursor: "pointer", color: Colors.green300, fontSize: '24px', marginTop: '9px'}}>add_circle_outline</FontIcon>
                  </div>
                </div>
          </div>
        </div>
      </form>
    );
  }
}
