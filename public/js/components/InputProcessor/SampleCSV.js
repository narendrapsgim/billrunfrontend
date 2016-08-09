import React, { Component } from 'react';

export default class SampleCSV extends Component {
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
                         <div className="form-group" key={key}>
                           <div className="col-xs-2">
                             {field}
                           </div>
                           <div className="col-xs-2">
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
                           <div className="col-xs-2">
                             {field}
                           </div>
                         </div>
                       ));
 
    return (
      <form className="InputProcessor form-horizontal">
        <div className="form-group">
          <div className="col-xs-2">
            <label htmlFor="file_type">Name</label>
          </div>
          <div className="col-xs-2">
            <input id="file_type" className="form-control" onChange={onChangeName} value={settings.get('file_type')} />
            <p className="help-block">&nbsp;</p>
          </div>
        </div>
        <div className="form-group">
          <div className="col-xs-2">
            <label htmlFor="delimiter">Delimiter</label>
          </div>
          <div className="col-xs-6">
            <div className="col-xs-2" style={{paddingLeft: 0}}>
              <div className="input-group">
                <div className="input-group-addon">
                  <input type="radio" name="delimiter-type" value="separator" onChange={onSetDelimiterType} />By delimiter
                </div>
                <input id="separator"
                       className="form-control"
                       type="text"
                       maxLength="1"
                       disabled={settings.get('delimiter_type') !== "separator"}
                       style={{width: 30}}
                       onChange={onChangeDelimiter}
                       value={settings.get('delimiter')} />
              </div>
            </div>
            <div className="col-xs-2" style={{marginTop: 10}}>
              <input type="radio" name="delimiter-type" value="fixed" onChange={onSetDelimiterType} />Fixed width
              <p className="help-block">&nbsp;</p>
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="col-xs-2">
            <label htmlFor="sample_csv">Select Sample CSV</label>
          </div>
          <div className="col-xs-2">
            <input type="file" id="sample_csv" onChange={onSelectSampleCSV} disabled={!settings.get('delimiter_type')} />
          </div>
        </div>
        {(() => {
           if (settings.get('fields').size > 0) {
             return (
               <div className="form-group">
                 <div className="col-xs-2">
                   <label>Field</label>
                 </div>
                 {(() => {             
                    if (settings.get('delimiter_type') === "fixed") {
                      return (
                        <div className="col-xs-2">
                          <label>Width</label>
                        </div>
                      );
                    }
                  })()}
               </div>
             );
           }})()}
        { fieldsHTML }
        <div className="form-group">
          <div className="col-xs-2">
            <input className="form-control" value={this.state.newField} onChange={(e) => { this.setState({newField: e.target.value}) } } placeholder="Field Name"/>
          </div>
          <div className="col-xs-2">
            <a onClick={this.addField} className="btn btn-primary">Add Field</a>
          </div>
        </div>
      </form>
    );
  }
}
/* 
   function mapStateToProps(state, props) {
   return {settings: state.inputProcessor};
   }

   export default connect(mapStateToProps)(SampleCSV); */
