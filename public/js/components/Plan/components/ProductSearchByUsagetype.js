import React, { Component } from 'react';
import Select from 'react-select';
import moment from 'moment';
import Immutable from 'immutable';

import { apiBillRun } from '../../../common/Api';


export default class ProductSearchByUsagetype extends Component {

  static defaultProps = {
    disabled: false,
    products: Immutable.List(),
  }

  static propTypes = {
    addRatesToGroup: React.PropTypes.func.isRequired,
    usaget: React.PropTypes.string.isRequired,
    disabled: React.PropTypes.bool,
    products: React.PropTypes.instanceOf(Immutable.List),
  }

  state = { val: null };

  shouldComponentUpdate(nextProps, nextState){
    const { disabled, usaget, products } = this.props;
    const { val } = this.state;

    return ( nextProps.disabled !== disabled
          || nextProps.usaget !== usaget
          || !Immutable.is(nextProps.products, products)
          || nextState.val !== val
    );
  }

  addRatesToGroup = (productKey) => {
    if(productKey){
      this.props.addRatesToGroup(productKey);
    }
    this.setState({val : ''});
  }

  findGroupRates = (input, callback) => {
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
              "$nin": products.toArray(),
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
    const { val } = this.state;
    if(typeof usaget === 'undefined'){
      return null;
    }
    return (
      <Select
        value={val}
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
