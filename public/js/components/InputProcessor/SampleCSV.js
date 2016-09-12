import React, { Component } from 'react';

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

  removeField(index, e) {
    this.props.onRemoveField.call(this, index);
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
          onAddField } = this.props;

    const selectDelimiterHTML = (
      <div className="form-group">
        <div className="col-lg-3">
          <label htmlFor="delimiter">Delimiter</label>
        </div>
        <div className="col-lg-4">
          <div className="col-lg-1" style={{marginTop: 8}}>
            <i className="fa fa-long-arrow-right"></i>
          </div>
          <div className="col-lg-4">
            <div className="input-group">
              <div className="input-group-addon">
                <input type="radio" name="delimiter-type"
                       value="separator"
                       disabled={!settings.get('file_type')}
                       onChange={onSetDelimiterType}
                       checked={settings.get('delimiter_type') === "separator"} />By delimiter
              </div>
              <input id="separator"
                     className="form-control"
                     type="text"
                     maxLength="1"
                     disabled={!settings.get('file_type') || settings.get('delimiter_type') !== "separator"}
                     style={{width: 35}}
                     onChange={onChangeDelimiter}
                     value={settings.get('delimiter')} />
            </div>
          </div>
          <div className="col-lg-3" style={{marginTop: 10}}>
            <input type="radio" name="delimiter-type"
                   value="fixed"
                   disabled={!settings.get('file_type')}
                   onChange={onSetDelimiterType}
                   checked={settings.get('delimiter_type') === "fixed"} />Fixed width
          </div>
        </div>
      </div>
    );

    const fieldsHTML = settings.get('delimiter_type') === "fixed" ?
                       settings.get('fields').map((field, key) => (
                         <div className="form-group" key={key}>
                           <div className="col-lg-3">
                             <button type="button"
                                     className="btn btn-danger btn-circle"
                                     onClick={this.removeField.bind(this, key)}>
                               <i className="fa fa-minus" />
                             </button>
                             {field}
                           </div>
                           <div className="col-lg-2">
                             <input type="number"
                                    className="form-control"
                                    data-field={field}
                                    style={{width: 70}}
                                    onChange={onSetFieldWidth}
                                    value={settings.getIn(['field_widths', field])} />
                           </div>
                         </div>
                       )) :
                       settings.get('fields').map((field, key) => (
                         <div className="form-group" key={key}>
                           <div className="col-lg-2">
                             <button type="button"
                                     className="btn btn-danger btn-circle"
                                     onClick={this.removeField.bind(this, key)}>
                               <i className="fa fa-minus" />
                             </button>
                             { field } 
                           </div>
                         </div>
                       ));

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
                    onClick={this.addField}>
              <i className="fa fa-plus"/>
            </button>
          </div>
        </div>
      </div>
    );

    const selectCSVHTML =  (
      <div>
        <div className="form-group">
          <div className="col-lg-3">
            <label htmlFor="sample_csv">Select Sample CSV</label>
            <p className="help-block">Notice: Spaces will be convereted to underscores</p>
          </div>
          <div className="col-lg-4">
            <div className="col-lg-1" style={{marginTop: 8}}>
              <i className="fa fa-long-arrow-right"></i>
            </div>
            <div className="col-lg-9">
              <input type="file" id="sample_csv"
                     onChange={onSelectSampleCSV}
                     disabled={!settings.get('file_type') || !settings.get('delimiter_type') ||
                               settings.get('delimiter_type') !== "separator"} />
            </div>
          </div>
        </div>
        { setFieldsHTML }
      </div>
    );

    return (
      <form className="InputProcessor form-horizontal">
        <div className="form-group">
          <div className="col-lg-3">
            <label htmlFor="file_type">Name</label>
          </div>
          <div className="col-lg-4">
            <div className="col-lg-1" style={{marginTop: 8}}>
              <i className="fa fa-long-arrow-right"></i>
            </div>
            <div className="col-lg-9">
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
