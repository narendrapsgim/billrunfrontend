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
    let product_type_options = ["Metered", "Tiered"].map((type, key) => {
      return (<MenuItem value={type} primaryText={type} key={key} />)
    });


    let { product_properties,
          onChangeItemSelectFieldValue,
          onChangeItemFieldValue,
          onAddProductProperties,
          onRemoveProductProperties } = this.props;

    return (
      <div className="AddItem">
        <h4>Add Product</h4>
        <div className="row">
          <div className="col-md-6">
            <div className="box">
            </div>
          </div>
        </div>
        { product_properties.map((prop, key) => {
            return (
              <div className="row" key={key}>
                <div className="col-xs-2">
                  <div className="box">
                    <SelectField
                        id="ProductType"
                        floatingLabelText="Product Type"
                        style={{width: "150px"}}
                        onChange={onChangeItemSelectFieldValue.bind(this, "ProductType", key)}
                        value={prop["ProductType"]}
                    >
                      {product_type_options}
                    </SelectField>
                  </div>
                </div>
                <div className="col-xs-2">
                  <div className="box">
                    <TextField
                        id="FlatRate"
                        floatingLabelText="Flat Rate"
                        type="number"
                        onChange={onChangeItemFieldValue.bind(this, "FlatRate", key)}
                        value={prop["FlatRate"]}
                        style={{width: "150px"}}
                    />
                  </div>
                </div>
                <div className="col-xs-2">
                  <div className="box">
                    <TextField
                        id="PerUnit"
                        floatingLabelText="Per Unit"
                        type="number"
                        style={{width: "150px"}}
                        onChange={onChangeItemFieldValue.bind(this, "PerUnit", key)}
                        value={prop["PerUnit"]}
                    />
                  </div>
                </div>
                <div className="col-xs-2">
                  <div className="box">
                    <TextField
                        id="Type"
                        floatingLabelText="Type"
                        type="text"
                        style={{width: "150px"}}
                        onChange={onChangeItemFieldValue.bind(this, "Type", key)}
                        value={prop["Type"]}
                    />
                  </div>
                </div>
                <div className="col-xs-2">
                  <div className="box">
                    <FloatingActionButton mini={true} secondary={true} style={{margin: "20px"}} onMouseUp={onRemoveProductProperties.bind(this, key)}>
                      <ContentRemove />
                    </FloatingActionButton>              
                  </div>
                </div>
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
