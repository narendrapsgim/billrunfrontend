import React, { Component } from 'react';
import { connect } from 'react-redux';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
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
      <div className="AddItem">
        <h4>Add Product</h4>
        <div className="row">
          <div className="col-md-4">
            <label for="ProductName">Product Name</label>
            <input type="text" className="form-control" id="ProductName" onChange={onChangeItemFieldValue.bind(this, "ProductName", -1)} />
          </div>
        </div>
        { product_properties.properties.map((prop, key) => {
            return (
              <div className="row" key={key}>
                <div className="col-md-2">
                  <label for="ProductType">Product Type</label>
                  <select
                      id="ProductType"
                      className="form-control"
                      onChange={onChangeItemFieldValue.bind(this, "ProductType", key)}
                      value={prop["ProductType"]}>
                    {product_type_options}
                  </select>
                </div>
                <div className="col-md-1">
                  <label for="FlatRate">Flat Rate</label>
                  <input type="number"
                         className="form-control"
                         id="FlatRate"
                         onChange={onChangeItemFieldValue.bind(this, "FlatRate", key)}
                         value={prop["FlatRate"]}
                  />
                </div>
                <div className="col-md-1">
                  <label for="PerUnit">Unit</label>
                  <input type="text"
                         className="form-control"
                         id="PerUnit"
                         onChange={onChangeItemFieldValue.bind(this, "PerUnit", key)}
                         value={prop["PerUnit"]}
                  />
                </div>
                {(() => {  /* only show remove button if there is more than one interval */
                   if (product_properties.properties.length > 1) {
                     return (
                       <div className="col-xs-2">
                         <div className="box">
                           <FloatingActionButton mini={true} secondary={true} style={{margin: "20px"}} onMouseUp={onRemoveProductProperties.bind(this, key)}>
                             <ContentRemove />
                           </FloatingActionButton>              
                         </div>
                       </div>
                     )
                   }
                 })()}
              </div>
            );
          }) }
              <div className="col-xs-1">
                <div className="box">
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
  return state.plan || {};
}

export default connect(mapStateToProps)(Product);
