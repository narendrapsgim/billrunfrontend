import React from 'react';
import aja from 'aja';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

export default class Aggregate extends React.Component {

  constructor(props) {
    super(props);
    this.styles = {
      input: { margin: '5px', height: '40px' },
      button: { margin: '5px'},
      actions: { margin: '10px', height: '40px', display: 'inline-block' }
    }
    this.groupBy= props.groupBy;
    this.fields= props.fields;
    this.methods= props.methods;
    this.filters = props.filters;
    this.onDataChange = props.onDataChange;

    this.state = { on : false, to: false , method: false, popupOpen: false, popupMessage: '' };

    this.aggregateOnChanged = this.aggregateOnChanged.bind(this);
    this.aggregateToChanged = this.aggregateToChanged.bind(this);
    this.aggregateMethodChanged = this.aggregateMethodChanged.bind(this);
    this.onAggregate = this.onAggregate.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleClosePopup = this.handleClosePopup.bind(this);
  }

  aggregateOnChanged  (event, index, value) { this.setState({on:value}); };
  aggregateToChanged (event, index, value) { this.setState({to:value}); };
  aggregateMethodChanged (event, index, value) { this.setState({method:value}); };

  handleError(resp) {
    this.setState({popupMessage: resp.desc, popupOpen: true});
  }

  handleClosePopup() {
    this.setState({popupOpen: false});
  }

  onAggregate(event) {
    let callback = this.onDataChange;
    let url = `${globalSetting.serverUrl}/api/queryaggregate`;
    let filterStr = this.props.buildSearchQueryArg();
    url += `?query=${JSON.stringify(filterStr)}&groupby={"${this.state.on}":"$${this.state.on}"}&aggregate={"${this.state.to}":{"${this.state.method}":"$${this.state.to}"}}`;
    this.serverRequest = aja()
      .method('get')
      .url(url)
      .on('success', (response) => {
        if(response && response.status){
          if(callback) {
            callback(response);
          }
        } else {
          this.handleError(response);
        }
      })
      .on('timeout', (response) => {
        this.handleError(response);
      })
      .on('error', (response) => {
        this.handleError(response);
      })
      .go();
  }

  render() {
    return (
      <div>
        <SelectField floatingLabelText="Group By" value={this.state.on} onChange={this.aggregateOnChanged} style={this.styles.input} >
          { this.groupBy.map((field,i) =>  { return ( <MenuItem value={field.key} key={field.key} primaryText={field.label} />); }) }
        </SelectField>
        <SelectField floatingLabelText="Field" value={this.state.to} onChange={this.aggregateToChanged} style={this.styles.input} >
          { this.fields.map((field,i) =>  { return ( <MenuItem value={field.key} key={field.key} primaryText={field.label} />); }) }
        </SelectField>
        <SelectField floatingLabelText="Method" value={this.state.method} onChange={this.aggregateMethodChanged} style={this.styles.input}>
          { this.methods.map((field,i) =>  { return ( <MenuItem value={field.key} key={field.key} primaryText={field.label} />); }) }
        </SelectField>
        <div style={this.styles.actions} >
          <RaisedButton label="Aggregate"  onClick={this.onAggregate} style={this.styles.button}/>
          <RaisedButton label="Clear" onClick={this.props.onClear} style={this.styles.button}/>
        </div>

        <Dialog
            actions={<FlatButton
                      label="Ok"
                      primary={true}
                      onTouchTap={this.handleClosePopup}
                                 />}
            modal={false}
            open={this.state.popupOpen}
            onRequestClose={this.handleClosePopup}
        >
          <div>{this.state.popupMessage}</div>
        </Dialog>
      </div>
    );
  }
}
