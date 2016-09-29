import React, { Component } from 'react';

/* COMPONENTS */
import SelectDelimiter from './SampleCSV/SelectDelimiter';
import SelectCSV from './SampleCSV/SelectCSV';
import CSVFields from './SampleCSV/CSVFields';

export default class SampleCSV extends Component {
  constructor(props) {
    super(props);

    this.addField = this.addField.bind(this);
    this.removeAllFields = this.removeAllFields.bind(this);
    
    this.state = {
      newField: ''
    };
  }

  addField(val, e) {
    this.props.onAddField.call(this, this.state.newField);
    this.setState({newField: ''});
  }

  removeAllFields() {
    const r = confirm("Are you sure you want to remove all fields?");
    if (r) {
      this.props.onRemoveAllFields.call(this);
    }
  }
  
  render() {
    let { settings,
          onChangeName,
          onSetDelimiterType,
          onChangeDelimiter,
          onSelectSampleCSV,
          onSetFieldWidth,
          onRemoveField,
          onAddField } = this.props;

    const selectDelimiterHTML = (
      <SelectDelimiter settings={settings}
                       onSetDelimiterType={onSetDelimiterType}
                       onChangeDelimiter={onChangeDelimiter} />
    );

    const fieldsHTML = (<CSVFields onRemoveField={onRemoveField} settings={settings} onSetFieldWidth={onSetFieldWidth} />);

    const setFieldsHTML = (
      <div>
        <div className="form-group">
          <div className="col-lg-3">
            <label>Field <small><a onClick={this.removeAllFields}>(remove all)</a></small></label>
          </div>
          {(() => {             
             if (settings.get('delimiter_type') === "fixed") {
               return (
                 <div className="col-lg-3">
                   <label>Width</label>
                 </div>
               );
             }
           })()}
        </div>
        { fieldsHTML }
        <div className="form-group">
          <div className="col-lg-3">
            <input className="form-control" value={this.state.newField} onChange={(e) => { this.setState({newField: e.target.value}) } } placeholder="Field Name"/>
          </div>
          <div className="col-lg-2">
            <button type="button"
                    className="btn btn-info btn-circle"
                    disabled={!settings.get('file_type') || !this.state.newField}
                    onClick={this.addField}>
              <i className="fa fa-plus"/>
            </button>
          </div>
        </div>
      </div>
    );

    const selectCSVHTML =  (
      <div>
        <SelectCSV onSelectSampleCSV={onSelectSampleCSV}
                   settings={settings} />
        { setFieldsHTML }
      </div>
    );

    return (
      <form className="InputProcessor form-horizontal">
        <div className="form-group">
          <div className="col-lg-3">
            <label htmlFor="file_type">Name</label>
          </div>
          <div className="col-lg-9">
            <div className="col-lg-1" style={{marginTop: 8}}>
              <i className="fa fa-long-arrow-right"></i>
            </div>
            <div className="col-lg-7">
              <input id="file_type" className="form-control" onChange={onChangeName} value={settings.get('file_type')} />
            </div>
          </div>
        </div>
        { selectDelimiterHTML }
        { selectCSVHTML }
      </form>
    );
  }
}
