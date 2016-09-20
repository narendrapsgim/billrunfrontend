import React, { Component } from 'react';
import Select from 'react-select';
import moment from 'moment';

import { apiBillRun } from '../../../common/Api';


export default class ProductSearchByUsagetype extends Component {
  constructor(props) {
    super(props);
    this.addRatesToGroup = this.addRatesToGroup.bind(this);
    this.findGroupRates = this.findGroupRates.bind(this);
    this.state = { val: null };
  }

  shouldComponentUpdate(nextProps, nextState){
    const { disabled, usaget, products } = this.props;
    const { val } = this.state;

    let isSameProducts = (nextProps.products.length === products.length)
      && nextProps.products.every((prod, i) => prod === products[i] );

    return ( nextProps.disabled !== disabled
          || nextProps.usaget !== usaget
          || !isSameProducts
          || nextState.val !== val
    );
  }

  addRatesToGroup(productKey){
    if(productKey){
      this.props.addRatesToGroup(productKey);
    }
    this.setState({val : null});
  }

  findGroupRates(input, callback){
    if(input && input.length){
      const { usaget, products } = this.props;
      let toadyApiString = moment();//  .format(globalSetting.apiDateTimeFormat);
      let request = {
        api: "find",
        params: [
          { collection: "rates" },
          { size: "20" },
          { page: "0" },
          { project: JSON.stringify({"key": 1}) },
          { query: JSON.stringify({
            "key": {
              "$nin": products,
              "$regex": input.toLowerCase(), "$options": "i"
            },
            [`rates.${usaget}`]: {"$exists": true},
            "to": {"$gte" : toadyApiString},
            "from": {"$lte" : toadyApiString},
          }) },
        ]
      };
      return apiBillRun(request).then(
        sussess => {
          let options = _.values(sussess.data[0].data.details);
          return { options, complete: true };
        },
        failure => {return { options : [] }}
      );
    } else {
      callback(null, { options: []});
    }
  }

  render() {
    const { disabled, usaget } = this.props;
    if(typeof usaget === 'undefined'){
      return null;
    }
    return (
      <Select
        value={this.state.val}
        onChange={this.addRatesToGroup}
        asyncOptions={this.findGroupRates}
        cacheAsyncResults={false}
        searchable={true}
        autoload={false}
        disabled={disabled}
        valueKey='key'
        labelKey='key'
        placeholder='Add product...'
        noResultsText='No products found.'
        searchPromptText='Type product key to search'
      />
    );
  }
}
