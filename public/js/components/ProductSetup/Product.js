import React, { Component } from 'react';

import Field from '../Field';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import ContentAdd from 'material-ui/svg-icons/content/add';

export default class Product extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    let product_type_options = ["Metered", "Tiered"].map((type, key) => (
      <option value={type} key={key}>{type}</option>
    ));

    let { productSettings,
          onChangeItemFieldValue,
          onAddProductProperties,
          onChangeItemSelectFieldValue,
          onRemoveProductProperties } = this.props;

    const available_units =[(<option disabled value="-1" key={-1}>Select Unit</option>),
                            ...["sms", "call"].map((unit, key) => (
                              <option value={unit} key={key}>{unit}</option>
                            ))];
    return (
      <div className="AddProduct">
        <div className="row">
          <div className="col-md-4">
            <label for="key">Product Name</label>
            <Field id="key"
                   coll="Product"
                   onChange={onChangeItemFieldValue.bind(this, "key", -1)}
                   value={productSettings.key}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-3">
            <select id="unit" className="form-control" onChange={onChangeItemSelectFieldValue.bind(this, "unit", -1)} value={productSettings.unit} defaultValue="-1">
              { available_units }
            </select>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <label for="description">Description</label>
            <Field id="description"
                   coll="Product"
                   onChange={onChangeItemFieldValue.bind(this, "description", -1)}
                   value={productSettings.description}
            />
          </div>
        </div>
        { productSettings.rates.map((rate, key) => (
              <div className="row" key={key}>
                <div className="col-md-1">
                  <label for="from">From</label>
                  <Field id="from"
                         coll="Product"
                         onChange={onChangeItemFieldValue.bind(this, "from", key)}
                         value={productSettings.rates[key].from}
                  />
                </div>
                <div className="col-md-1">
                  <label for="to">To</label>
                  <Field id="to"
                         coll="Product"
                         onChange={onChangeItemFieldValue.bind(this, "to", key)}
                         value={productSettings.rates[key].to}
                  />
                </div>
                <div className="col-md-1">
                  <label for="interval">Interval</label>
                  <Field id="interval"
                         onChange={onChangeItemFieldValue.bind(this, "interval", key)}
                         value={productSettings.rates[key].interval}
                  />
                </div>
                <div className="col-md-1">
                  <label for="price">Price</label>
                  <Field id="price"
                         onChange={onChangeItemFieldValue.bind(this, "price", key)}
                         value={productSettings.rates[key].price}
                  />
                </div>
                {(() => {  /* only show remove button if there is more than one interval */
                   if (productSettings.rates.length > 1) {
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
