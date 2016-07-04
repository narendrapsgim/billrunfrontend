import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Table } from 'react-bootstrap/lib';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

class FieldsMapping extends Component {
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
            <select id="time" className="form-control" onChange={onSetFieldMapping} value={settings.getIn(['processor', 'time'])} defaultValue="-1">
              { available_fields }
            </select>
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
          </div>
        </div>
        <div className="row" style={{marginLeft: "26px"}}>
          <div className="col-md-6 col-md-offset-3">
            <Table striped bordered condensed hover>
              <thead>
                <tr>
                  <th>Value</th>
                  <th>Unit Type</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {
                  settings.getIn(['processor', 'usaget_mapping']).map((usage_t, key) => (
                    <tr key={key}>
                      <td>{usage_t.get('pattern')}</td>
                      <td>{usage_t.get('usaget')}</td>
                      <td></td>
                    </tr>
                  ))
                }
                    <tr>
                      <td><input className="form-control" onChange={this.onChangePattern} value={this.state.pattern} /></td>
                      <td><input className="form-control" onChange={this.onChangeUsaget} value={this.state.usaget} /></td>
                      <td>
                        <FloatingActionButton mini={true} onMouseUp={this.addUsagetMapping}>
                          <ContentAdd />
                        </FloatingActionButton>
                      </td>
                    </tr>
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {settings: state.inputProcessor};
}

export default connect(mapStateToProps)(FieldsMapping);
