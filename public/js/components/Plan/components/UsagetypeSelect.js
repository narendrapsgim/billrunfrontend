import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Select from 'react-select';
import moment from 'moment';

import { getUsageTypes } from '../../../actions/planProductsActions';


class UsagetypeSelect extends Component {
  constructor(props) {
    super(props);
    this.loadSelectUsageTypes = this.loadSelectUsageTypes.bind(this);
    this.onSelectUsageType = this.onSelectUsageType.bind(this);
    this.filterUsageTypes = this.filterUsageTypes.bind(this);
    this.state = { val: null };
  }

  onSelectUsageType(key) {
    this.props.onChangeUsageType(key);
  }


  loadSelectUsageTypes(input, callback) {
    return getUsageTypes().then( this.filterUsageTypes, this.filterUsageTypes );
  }

  filterUsageTypes(responce = null){
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

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getUsageTypes }, dispatch);
}

export default connect(null, mapDispatchToProps)(UsagetypeSelect);
