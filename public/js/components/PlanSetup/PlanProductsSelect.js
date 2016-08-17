import React, { Component } from 'react';
import Select from 'react-select';
import moment from 'moment';
import Field from '../Field';
import Help from '../Help';
import { PlanDescription } from '../../FieldDescriptions';
import { apiBillRun } from '../../Api';


export default class PlanProductsSelect extends Component {
  constructor(props) {
    super(props);
    this.onSelectProduct = this.onSelectProduct.bind(this);
    this.getProducts = this.getProducts.bind(this);

    this.state = { val: null };
  }

  onSelectProduct (option) {
    if(option){
      this.props.onSelectProduct(option);
    }
    this.setState({val : null});
  }

  getProducts (input, callback) {
    if(input && input.length){
      let toadyApiString = moment();//  .format(globalSetting.apiDateTimeFormat);

      let query = {
        "key": {"$regex": input.toLowerCase(), "$options": "i"},
        "to": {"$gte" : toadyApiString},
        "from": {"$lte" : toadyApiString},
      };
      let request = [{
        api: "find",
        params: [
          { collection: "rates" },
          { size: "20" },
          { page: "0" },
          { project: JSON.stringify({"key": 1}) },
          { query: JSON.stringify(query) },
        ]
      }];

      return apiBillRun(request).then(
        sussess => {
          let options = _.values(sussess.data[0].data.details);
          return { options };
        },
        failure => {return { options : [] }}
      );
    } else {
      callback(null, { options: []});
    }
  }

  render() {
    return (
      <div key="select-product">
        <h4>Select Products <Help contents={PlanDescription.add_product} /></h4>
        <Select
          value={this.state.val}
          cacheAsyncResults={false}
          onChange={this.onSelectProduct}
          asyncOptions={this.getProducts}
          valueKey='key'
          labelKey='key'
          placeholder='Search by product key...'
          noResultsText='No products found, please try another key'
        />
      </div>
    );
  }
}
