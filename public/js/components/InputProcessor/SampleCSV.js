import React, { Component } from 'react';
import { connect } from 'react-redux';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

class SampleCSV extends Component {
  constructor(props) {
    super(props);

    this.addField = this.addField.bind(this);
    
    this.state = {
      newField: ''
    };
  }

  addField(val, e) {
    this.props.onAddField.call(this, this.state.newField);
    this.setState({newField: ''});
  }
  
  render() {
    let { settings,
          onChangeName,
          onSetDelimiterType,
          onChangeDelimiter,
          onSelectSampleCSV,
          onSetFieldWidth,
          onAddField } = this.props;

    const fieldsHTML = settings.get('delimiter_type') === "fixed" ?
                       settings.get('fields').map((field, key) => (
                         <div className="row" key={key}>
                           <div className="col-md-3">
                             {field}
                           </div>
                           <div className="col-md-3">
                             <input type="number"
                                    className="form-control"
                                    data-field={field}
                                    style={{width: 50}}
                                    onChange={onSetFieldWidth}
                                    value={settings.getIn(['field_widths', field])} />
                           </div>
                         </div>
                       )) :
                       settings.get('fields').map((field, key) => (
                         <div className="row" key={key}>
                           <div className="col-md-3">
                             {field}
                           </div>
                         </div>
                       ));
 
    return (
      <div className="InputProcessor">
        <div className="row">
          <div className="col-md-3">
            <label for="file_type">Name</label>
          </div>
          <div className="col-md-3">
            <input id="file_type" className="form-control" onChange={onChangeName} value={settings.get('file_type')} />
          </div>
        </div>
        <div className="row">
          <div className="col-md-3">
            <label for="delimiter">Delimiter</label>
          </div>
          <div className="col-md-6">
            <div className="col-md-3" style={{paddingLeft: 0}}>
              <div className="input-group">
                <div className="input-group-addon">
                  <input type="radio" name="delimiter-type" value="delimiter" onChange={onSetDelimiterType} />By delimiter
                </div>
                <input id="delimiter"
                       className="form-control"
                       type="text"
                       maxLength="1"
                       disabled={settings.get('delimiter_type') !== "delimiter"}
                       style={{width: 5}}
                       onChange={onChangeDelimiter}
                       value={settings.get('delimiter')} />
              </div>
            </div>
            <div className="col-md-3" style={{marginTop: 10}}>
              <input type="radio" name="delimiter-type" value="fixed" onChange={onSetDelimiterType} />Fixed width
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-3">
            <label for="sample_csv">Select Sample CSV</label>
          </div>
          <div className="col-md-3">
            <input type="file" id="sample_csv" onChange={onSelectSampleCSV} disabled={!settings.get('delimiter_type')} />
          </div>
        </div>
        <h4>Fields</h4>
        { fieldsHTML }
        <div className="row">
          <div className="col-md-3">
            <input className="form-control" value={this.state.newField} onChange={(e) => { this.setState({newField: e.target.value}) } } placeholder="Add additional field"/>
          </div>
          <div className="col-md-3">
            <FloatingActionButton mini={true} onMouseUp={this.addField}>
              <ContentAdd />
            </FloatingActionButton>               
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {settings: state.inputProcessor};
}

export default connect(mapStateToProps)(SampleCSV);
