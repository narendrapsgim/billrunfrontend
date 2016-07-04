import React, { Component } from 'react';
import { connect } from 'react-redux';

import Field from '../Field';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import ContentAdd from 'material-ui/svg-icons/content/add';

class Product extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    let product_type_options = ["Metered", "Tiered"].map((type, key) => (
      <option value={type} key={key}>{type}</option>
    ));

    let { product_properties,
          onChangeItemFieldValue,
          onAddProductProperties,
          onRemoveProductProperties } = this.props;

    return (
      <div className="AddProduct">
        <div className="row">
          <div className="col-md-4">
            <label for="key">Product Name</label>
            <input type="text" className="form-control" id="key" onChange={onChangeItemFieldValue.bind(this, "key", -1)} value={product_properties.key} />
          </div>
        </div>
        { product_properties.rates.map((rate, key) => (
              <div className="row" key={key}>
                <div className="col-md-1">
                  <label for="from">From</label>
                  <Field id="from"
                         coll="Product"
                         onChange={onChangeItemFieldValue.bind(this, "from", key)}
                         value={product_properties.rates[key].from}
                  />
                </div>
                <div className="col-md-1">
                  <label for="to">To</label>
                  <Field id="to"
                         coll="Product"
                         onChange={onChangeItemFieldValue.bind(this, "to", key)}
                         value={product_properties.rates[key].to}
                  />
                </div>
                <div className="col-md-1">
                  <label for="interval">Interval</label>
                  <Field id="interval"
                         onChange={onChangeItemFieldValue.bind(this, "interval", key)}
                         value={product_properties.rates[key].interval}
                  />
                </div>
                <div className="col-md-1">
                  <label for="price">Price</label>
                  <Field id="price"
                         onChange={onChangeItemFieldValue.bind(this, "price", key)}
                         value={product_properties.rates[key].price}
                  />
                </div>
                {(() => {  /* only show remove button if there is more than one interval */
                   if (product_properties.rates.length > 1) {
                     return (
                       <div className="col-md-2">
                         <FloatingActionButton mini={true} secondary={true} style={{marginTop: "30px", marginLeft: "15px"}} onMouseUp={onRemoveProductProperties.bind(this, key)}>
                           <ContentRemove />
                         </FloatingActionButton>
                       </div>
                     )
                   }
                 })()}
              </div>
          )) }
              <div className="row">
                <div className="col-xs-1">
                  <FloatingActionButton mini={true} style={{margin: "20px"}} onMouseUp={onAddProductProperties}>
                    <ContentAdd />
                  </FloatingActionButton>
                </div>
              </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {product_properties: state.product};
}

export default connect(mapStateToProps)(Product);
