import React from 'react';
import aja from 'aja';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';


export default class Aggregate extends React.Component {

  constructor(props) {
    super(props);
    this.groupBy= props.groupBy;
    this.fields= props.fields;
    this.methods= props.methods;
    this.filters = props.filters;
    this.onDataChange = props.onDataChange;

    this.state = { on : false, to: false , method: false };

    this.aggregateOnChanged = this.aggregateOnChanged.bind(this);
    this.aggregateToChanged = this.aggregateToChanged.bind(this);
    this.aggregateMethodChanged = this.aggregateMethodChanged.bind(this);
    this.onAggregate = this.onAggregate.bind(this);
    this.handleError = this.handleError.bind(this);

  }

  aggregateOnChanged  (event, index, value) { this.setState({on:value}); };
  aggregateToChanged (event, index, value) { this.setState({to:value}); };
  aggregateMethodChanged (event, index, value) { this.setState({method:value}); };

  handleError(resp) {
    console.log("ERROR", resp);
  }
  
  onAggregate(event) {
    let callback = this.onDataChange;
    let url = `${globalSetting.serverUrl}/api/queryaggregate`;

    let filterKeys = _.keys(this.props.filters);
    let filterStr  = _.reduce(filterKeys, (acc, key) => {
      if (_.isEmpty(this.props.filters[key])) return acc;
      acc.push(`"${key}":${this.props.filters[key]}`);
      return acc;
    }, []);

    url += `?query={${filterStr.join(',')}}&groupby={"${this.state.on}":"$${this.state.on}"}&aggregate={"${this.state.to}":{"${this.state.method}":"$${this.state.to}"}}`;

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
        <SelectField floatingLabelText="Group By" value={this.state.on} onChange={this.aggregateOnChanged}>
          { this.groupBy.map((field,i) =>  { return ( <MenuItem value={field.key} key={field.key} primaryText={field.label} />); }) }
        </SelectField>
        <SelectField floatingLabelText="Field" value={this.state.to} onChange={this.aggregateToChanged}>
          { this.fields.map((field,i) =>  { return ( <MenuItem value={field.key} key={field.key} primaryText={field.label} />); }) }
        </SelectField>
        <SelectField floatingLabelText="Method" value={this.state.method} onChange={this.aggregateMethodChanged}>
          { this.methods.map((field,i) =>  { return ( <MenuItem value={field.key} key={field.key} primaryText={field.label} />); }) }
        </SelectField>
        <RaisedButton label="Aggregate"  onClick={this.onAggregate} />
        <RaisedButton label="Clear" onClick={this.props.onClear} />
      </div>
    );
  }
}
