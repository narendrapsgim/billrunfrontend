import React, { Component } from 'react';
import Select from 'react-select';

import { getUsageTypes } from '../../../actions/planProductsActions';


export default class UsagetypeSelect extends Component {

  static propTypes = {
    value: React.PropTypes.string.isRequired,
    onChangeUsageType: React.PropTypes.func.isRequired,
  }

  state = { val: null }

  onSelectUsageType = (key) => {
    this.props.onChangeUsageType(key);
  }


  loadSelectUsageTypes = (input, callback) => {
    return getUsageTypes().then( this.filterUsageTypes, this.filterUsageTypes );
  }

  filterUsageTypes = (responce = null) => {
    if(responce === null || !responce.data || !responce.data[0] || !responce.data[0].data.details){
      return { options: [] }
    }
    let options = _.values(responce.data[0].data.details)
      .map( (option => { return {key:option}}));
    return { options, complete: true };
  }

  render() {
    const { value } = this.props;
    return (
        <Select
            value={value}
            cacheAsyncResults={false}
            onChange={this.onSelectUsageType}
            asyncOptions={this.loadSelectUsageTypes}
            searchable={false}
            valueKey='key'
            labelKey='key'
            placeholder='Select usage type...'
            noResultsText='No usage types found.'
            searchPromptText='No usage types found.'
        />

    );
  }
}
