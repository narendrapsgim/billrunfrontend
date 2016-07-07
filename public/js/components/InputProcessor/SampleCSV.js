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
          onChangeDelimiter,
          onSelectSampleCSV,
          onAddField } = this.props;

    return (
      <div className="InputProcessor">
        <div className="row">
          <div className="col-md-3">
            <label for="delimiter">Delimiter</label>
          </div>
          <div className="col-md-3">
            <input id="delimiter"
                   className="form-control"
                   type="text"
                   maxLength="1"
                   style={{width: 5}}
                   onChange={onChangeDelimiter}
                   value={settings.get('delimiter')} />
            <p className="help-block">Delimiter used in CSV file</p>
          </div>
        </div>
        <div className="row">
          <div className="col-md-3">
            <label for="sample_csv">Select Sample CSV</label>
          </div>
          <div className="col-md-3">
            <input type="file" id="sample_csv" onChange={onSelectSampleCSV} />
          </div>
        </div>
        <h4>Fields</h4>
        {settings.get('fields').map((field, key) => (
           <div className="row" key={key}>
             <div className="col-md-3">
               {field}
             </div>
           </div>
         ))}
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
