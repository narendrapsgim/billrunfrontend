import React, { Component } from 'react';
import PlanProductsList from './PlanProductsList'
import PlanProductsSelect from './PlanProductsSelect'


export default class PlanProductsTab extends Component {


  render() {
    let { planName, processors} = this.props;

    if(planName && processors && processors.size){
      let units = _.uniq(_.flatten(processors.map(processor => {
        return processor.get('rate_calculators').keySeq().map(unit => { return unit; });
      }).toJS()));

      return (
        <form className="form-horizontal basic-products-settings">
          <div className="add-products" style={{display: 'flex', marginTop: 20}}>
            <div style={{flex: '1 0 0'}}></div>
            <div style={{flex: '5 0 0'}}>
              <PlanProductsSelect/>
              <PlanProductsList units={units} />
            </div>
            <div style={{flex: '1 0 0'}}></div>
          </div>
        </form>
      );
    } else {
      return null;
    }
  }


}
