import React, { Component } from 'react';
import ProductPricePlanOverride from '../ProductSetup/ProductPricePlanOverride';


export default class PlanProductsList extends Component {

  render() {
    const { planName, planProducts } = this.props;

    return (
      <div className="form-horizontal basic-products-settings">
        { planProducts.size > 0
          ?
          this.props.planProducts.map( (prod, i) => (
            <div key={prod.getIn(['_id', '$id'])}>
              <hr/>
              <ProductPricePlanOverride
                item={prod}
                planName={planName}
                onProductRemove={this.props.onProductRemove}
                onProductUndoRemove={this.props.onProductUndoRemove}
                onProductRemoveRate={this.props.onProductRemoveRate}
                onProductEditRate={this.props.onProductEditRate}
                onProductAddRate={this.props.onProductAddRate}
                onProductInitRate={this.props.onProductInitRate}
                onProductRestore={this.props.onProductRestore}
              />
            </div>
          ))
          :
          <div> <hr/> No overridden prices for this plan </div>
        }
      </div>
    );
  }

}
