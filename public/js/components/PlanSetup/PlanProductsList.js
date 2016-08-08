import React, { Component } from 'react';
import { connect } from 'react-redux';
import FontIcon from 'material-ui/FontIcon';
import Select from 'react-select';
import DateTimeField from '../react-bootstrap-datetimepicker/lib/DateTimeField';
import Immutable from 'immutable';
import moment from 'moment';


import {getExistPlanProducts, removePlanProduct, undoRemovePlanProduct} from '../../actions/planProductsActions';
import Field from '../Field';
import Help from '../Help';
import { PlanDescription } from '../../FieldDescriptions';
import ProductPricePlanOverride from '../ProductSetup/ProductPricePlanOverride';

//TODO: move to single place // Be sure to include styles at some point, probably during your bootstrapping
// import 'react-select/dist/react-select.css';

export default class PlanProductsList extends Component {
  constructor(props) {
    super(props);
    this.renderContent = this.renderContent.bind(this);
    this.onRemoveProduct = this.onRemoveProduct.bind(this);
    this.onUndoRemoveProduct = this.onUndoRemoveProduct.bind(this);
    // this.optionRenderer = this.optionRenderer.bind(this);
    this.state = {};
  }

  componentWillMount() {
    let {units, planName} = this.props;
    this.props.dispatch(getExistPlanProducts(units, planName));
  }



  componentWillReceiveProps(nextProps) {
    // console.log('componentWillReceiveProps : ', nextProps);
  }

  onRemoveProduct(key){
    let {planName} = this.props;
    if(key){
      this.props.dispatch(removePlanProduct(key, planName));
    }
  }

  onUndoRemoveProduct(key){
    if(key){
      this.props.dispatch(undoRemovePlanProduct(key));
    }
  }

  renderContent(){
    const {planProducts} = this.props;

    console.log("Should run only once PlanProductsListrenderContent", planProducts.size);

    let content = null;
    if(planProducts.size){
      content = [];
      this.props.planProducts.forEach( (prod, i) => content.push(
        <div key={prod.get('id')}>
          <hr/>
          <ProductPricePlanOverride item={prod} onRemoveProduct={this.onRemoveProduct} onUndoRemoveProduct={this.onUndoRemoveProduct}/>
        </div>
      ));
    } else {
      content = (
        <div>
          <hr/>
          No overridden prices for this plan
        </div>
      );
    }
    return content;
  }


  render() {
    return (
      <div className="form-horizontal basic-products-settings">
        {this.renderContent()}
      </div>
    );
  }


}

function mapStateToProps(state, props) {
  return  { planProducts: state.planProducts };
}

export default connect(mapStateToProps)(PlanProductsList);
