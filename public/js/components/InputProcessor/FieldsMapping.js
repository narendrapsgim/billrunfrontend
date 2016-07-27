import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Table } from 'react-bootstrap/lib';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

export default class FieldsMapping extends Component {
  constructor(props) {
    super (props);

    this.onChangePattern = this.onChangePattern.bind(this);
    this.onChangeUsaget  = this.onChangeUsaget.bind(this);
    this.addUsagetMapping = this.addUsagetMapping.bind(this);

    this.state = {
      pattern: "",
      usaget: ""
    };
  }

  onChangePattern(e) {
    this.setState({pattern: e.target.value});    
  }

  onChangeUsaget(e) {
    this.setState({usaget: e.target.value});
  }

  addUsagetMapping(e) {
    if (!this.props.settings.getIn(['processor', 'src_field'])) return;
    this.props.onAddUsagetMapping.call(this, this.state);
    this.setState({pattern: "", usaget: ""});
  }

  render() {
    const { settings,
            onSetFieldMapping } = this.props;
    const available_fields = [(<option disabled value="-1" key={-1}>Select Field</option>),
                              ...settings.get('fields').map((field, key) => (
                                <option value={field} key={key}>{field}</option>
                              ))];

    return (
      <div className="FieldsMapping">
        <div className="row">
          <div className="col-md-3">
            <label>Time</label>
          </div>
          <div className="col-md-3">
            <select id="date_field" className="form-control" onChange={onSetFieldMapping} value={settings.getIn(['processor', 'date_field'])} defaultValue="-1">
              { available_fields }
            </select>
            <p className="help-block">Time of record creation</p>
          </div>
        </div>
        <div className="row">
          <div className="col-md-3">
            <label>Volume</label>
          </div>
          <div className="col-md-3">
            <select id="volume_field" className="form-control" onChange={onSetFieldMapping} value={settings.getIn(['processor', 'volume_field'])} defaultValue="-1">
              { available_fields }
            </select>
            <p className="help-block">Amount calculated</p>
          </div>
        </div>
        <div className="row">
          <div className="col-md-3">
            <label>Usage types</label>
          </div>
          <div className="col-md-3">
            <select id="src_field" className="form-control" onChange={onSetFieldMapping} value={settings.getIn(['processor', 'src_field'])} defaultValue="-1">
              { available_fields }
            </select>
            <p className="help-block">Types of usages and units used for measuring usage</p>
          </div>
        </div>
        <div className="row" style={{marginLeft: "26px"}}>
          <div className="col-md-6 col-md-offset-3">
            <div className="row">
              <div className="col-md-2">
                <strong className="text-uppercase">Value</strong>
              </div>
              <div className="col-md-2">
                <strong className="text-uppercase">Unit Type</strong>
              </div>
            </div>
            {
              settings.getIn(['processor', 'usaget_mapping']).map((usage_t, key) => (
                <div className="row" key={key}>
                  <div className="col-md-2">{usage_t.get('pattern')}</div>
                  <div className="col-md-2">{usage_t.get('usaget')}</div>
                </div>
              ))
            }
                <div className="row">
                  <div className="col-md-2"><input className="form-control" onChange={this.onChangePattern} value={this.state.pattern} /></div>
                  <div className="col-md-2"><input className="form-control" onChange={this.onChangeUsaget} value={this.state.usaget} /></div>
                  <div className="col-md-2">
                    <FloatingActionButton mini={true} onMouseUp={this.addUsagetMapping}>
                      <ContentAdd />
                    </FloatingActionButton>
                  </div>
                </div>
          </div>
        </div>
      </div>
    );
  }
}
