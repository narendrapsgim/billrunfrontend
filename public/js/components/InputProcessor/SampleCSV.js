import React, { Component } from 'react';
import { connect } from 'react-redux';

/* COMPONENTS */
import Field from '../Field';
import SelectDelimiter from './SampleCSV/SelectDelimiter';
import SelectCSV from './SampleCSV/SelectCSV';
import SelectJSON from './SampleCSV/SelectJSON';
import CSVFields from './SampleCSV/CSVFields';

class SampleCSV extends Component {
  constructor(props) {
    super(props);

    this.removeAllFields = this.removeAllFields.bind(this);
  }

  removeAllFields() {
    const r = confirm("Are you sure you want to remove all fields?");
    if (r) {
      this.props.onRemoveAllFields.call(this);
    }
  }
  
  render() {
    let { settings,
          type,
          format,
          onChangeName,
          onSetDelimiterType,
          onChangeDelimiter,
          onSelectSampleCSV,
          onSelectJSON,
          onSetFieldWidth,
          onRemoveField,
          onMoveFieldUp,
          onMoveFieldDown,
          onChangeCSVField,
          onAddField } = this.props;

    const selectDelimiterHTML =
      type === 'api'
      ? (null)
      : (<SelectDelimiter settings={settings}
                          onSetDelimiterType={onSetDelimiterType}
                          onChangeDelimiter={onChangeDelimiter} />);

    const fieldsHTML = (<CSVFields onMoveFieldUp={onMoveFieldUp} onMoveFieldDown={onMoveFieldDown} onChangeCSVField={onChangeCSVField} onRemoveField={onRemoveField} settings={settings} onSetFieldWidth={onSetFieldWidth} />);

    const setFieldsHTML = (
      <div className="panel panel-default">
        <div className="panel-heading">
          CDR Fields
        </div>
        <div className="panel-body">
          <div className="form-group">
            <div className="col-lg-4">
              <label>Field name</label>&nbsp;&nbsp;
              <button type="button"
                      disabled={settings.get('fields', []).size < 1}
                      className="btn btn-default btn-xs"
                      onClick={this.removeAllFields}>
                <i className="fa fa-trash-o" /> Remove all
              </button>
            </div>
            {(() => {             
               if (settings.get('delimiter_type') === "fixed") {
                 return (
                   <div className="col-lg-2">
                     <label>Width</label>
                   </div>
                 );
               }
             })()}
          </div>
          { fieldsHTML }
          <div className="form-group">
            <div className="col-lg-2">
              <button type="button"
                      className="btn btn-primary btn-sm"
                      onClick={onAddField}>
                <i className="fa fa-plus"/> Add Field
              </button>
            </div>
          </div>
        </div>
      </div>
    );

    const selectCSVHTML =
      type === "api"
      ? (<div><SelectJSON onSelectJSON={ onSelectJSON } settings={ settings } /></div>)
      : (<div><SelectCSV onSelectSampleCSV={onSelectSampleCSV} settings={settings} /></div>);

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
              <Field id="file_type" onChange={ onChangeName } value={ settings.get('file_type', '') } />
            </div>
          </div>
        </div>
        { selectDelimiterHTML }
        { selectCSVHTML }
        { setFieldsHTML }        
      </form>
    );
  }
}

export default connect()(SampleCSV);
