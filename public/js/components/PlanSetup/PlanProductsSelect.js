import React, { Component } from 'react';
import { connect } from 'react-redux';
import FontIcon from 'material-ui/FontIcon';
import Select from 'react-select';
import DateTimeField from '../react-bootstrap-datetimepicker/lib/DateTimeField';
import Immutable from 'immutable';
import moment from 'moment';


import {showStatusMessage} from '../../actions';
import {getProductByKey} from '../../actions/planProductsActions';
import Field from '../Field';
import Help from '../Help';
import { PlanDescription } from '../../FieldDescriptions';
import { apiBillRun, delay} from '../../Api';
import ProductPricePlanOverride from '../ProductSetup/ProductPricePlanOverride';

//TODO: move to single place // Be sure to include styles at some point, probably during your bootstrapping
// import 'react-select/dist/react-select.css';

export default class PlanProductsSelect extends Component {
  constructor(props) {
    super(props);

    this.onSelectNewProductChange = this.onSelectNewProductChange.bind(this);
    this.getProducts = this.getProducts.bind(this);
    // this.optionRenderer = this.optionRenderer.bind(this);

    this.state = { };
  }

  onSelectNewProductChange (option) {
    if(option){
      console.log("new Produc selected : ", option._id['$id']);
      this.props.dispatch(getProductByKey(option.key));
    }
  }

  // optionRenderer(option){
  //   return option.label;
  // }


  getProducts (input, callback) {
    if(input.length){
      let toadyApiString = moment();//  .format(globalSetting.apiDateTimeFormat);
      let query = {
        queries : [{
          request: {
            api: "find",
            params: [
              { collection: "rates" },
              { size: "20" },
              { page: "0" },
              { query: JSON.stringify({
                "key": {"$regex": input.toLowerCase(), "$options": "i"},
                "to": {"$gte" : toadyApiString},
                "from": {"$lte" : toadyApiString},
              }) },
              { project: JSON.stringify({"key": 1}) },
            ]
          }
        }]
      };

      return apiBillRun(query).then( (response) => {
        return { options: _.values(response.data[0].data) };
      });
    } else {
      callback(null, { options: []});
    }
  }

  render() {
    // optionRenderer={this.optionRenderer}
    return (
      <div>
        <h4>Select Products <Help contents={PlanDescription.add_product} /></h4>
        <Select.Async
          onChange={this.onSelectNewProductChange}
          placeholder='Search by product key...'
          cache={false}
          loadOptions={this.getProducts}
          labelKey="key"
          autoload={false}
          valueKey="['_id']['$id']"
        />
      </div>
    );
  }


}

function mapStateToProps(state, props) {
  return  { };
}

export default connect(mapStateToProps)(PlanProductsSelect);
