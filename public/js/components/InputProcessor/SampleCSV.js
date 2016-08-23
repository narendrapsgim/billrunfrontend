import React, { Component } from 'react';
import FontIcon from 'material-ui/FontIcon';
import * as Colors from 'material-ui/styles/colors'

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

  removeField(index, e) {
    this.props.onRemoveField.call(this, index);
  }
  
  render() {
    let { settings,
          onChangeName,
          onSetDelimiterType,
          onChangeDelimiter,
          onSelectSampleCSV,
          onSetFieldWidth,
          onAddField,
          onRemoveField } = this.props;

    const selectDelimiterHTML = settings.get('file_type') ? (
      <div className="form-group">
        <div className="col-xs-2">
          <label htmlFor="delimiter">Delimiter</label>
        </div>
        <div className="col-xs-6">
          <div className="col-xs-3" style={{paddingLeft: 0}}>
            <div className="input-group">
              <div className="input-group-addon">
                <input type="radio" name="delimiter-type"
                       value="separator"
                       onChange={onSetDelimiterType}
                       checked={settings.get('delimiter_type') === "separator"} />By delimiter
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
          <div className="col-xs-3" style={{marginTop: 10}}>
            <input type="radio" name="delimiter-type"
                   value="fixed"
                   onChange={onSetDelimiterType}
                   checked={settings.get('delimiter_type') === "fixed"} />Fixed width
            <p className="help-block">&nbsp;</p>
          </div>
        </div>
      </div>
    ) : (null);

    const fieldsHTML = settings.get('delimiter_type') === "fixed" ?
                       settings.get('fields').map((field, key) => (
                         <div className="form-group" key={key}>
                           <div className="col-xs-2">
                             <FontIcon onClick={this.removeField.bind(this, key)} className="material-icons" style={{cursor: "pointer", color: Colors.red300, fontSize: '13px', marginRight: '5px'}}>remove_circle_outline</FontIcon>
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
                             <FontIcon onClick={this.removeField.bind(this, key)} className="material-icons" style={{cursor: "pointer", color: Colors.red300, fontSize: '13px', marginRight: '5px'}}>remove_circle_outline</FontIcon>
                             { field } 
                           </div>
                         </div>
                       ));

    const setFieldsHTML = (
      <div>
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
        { fieldsHTML }
        <div className="form-group">
          <div className="col-xs-2">
            <input className="form-control" value={this.state.newField} onChange={(e) => { this.setState({newField: e.target.value}) } } placeholder="Field Name"/>
          </div>
          <div className="col-xs-2">
            <FontIcon onClick={this.addField} className="material-icons" style={{cursor: "pointer", color: Colors.green300, fontSize: '24px', paddingRight: '3px', marginTop: '10px'}}>add_circle_outline</FontIcon>
          </div>
        </div>
      </div>
    );

    const selectCSVHTML = ((settings.get('delimiter_type') === 'fixed' ||
                            settings.get('delimiter')) && settings.get('file_type')) ? (
      <div>
        <div className="form-group">
          <div className="col-xs-2">
            <label htmlFor="sample_csv">Select Sample CSV</label>
            <p className="help-block">Notice: Spaces will be convereted to underscores</p>
          </div>
          <div className="col-xs-2">
            <input type="file" id="sample_csv" onChange={onSelectSampleCSV} disabled={!settings.get('delimiter_type')} />
          </div>
        </div>
        { setFieldsHTML }
      </div>
    ) : (null);

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
        { selectDelimiterHTML }
        { selectCSVHTML }
      </form>
    );
  }
}
