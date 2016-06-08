import React, { Component } from 'react';

import TextField   from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import AutoComplete from 'material-ui/AutoComplete';
import MenuItem    from 'material-ui/MenuItem';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';

export default class AddItem extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.productNames = [
      "Product 1", "Some Item", "etc."
    ];
  }

  render() {
    let { productProperties,
          onChange,
          onAddProductProperties,
          onRemoveProductProperties } = this.props;

    let product_type_options = ["Metered", "Tiered"].map((type, key) => {
      return (<MenuItem value={key} primaryText={type} key={key} />)
    });

    let product_properties_html = productProperties.map((prop, key) => {
      return (
        <div className="row" key={key}>
          <div className="col-xs-2">
            <div className="box">
              <SelectField
                  id="ProductType"
                  floatingLabelText="Product Type"
                  style={{width: "150px"}}
                  onChange={onChange.bind(this, "ProductType", key)}
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
                  onChange={onChange.bind(this, "FlatRate", key)}
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
                  onChange={onChange.bind(this, "PerUnit", key)}
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
                  onChange={onChange.bind(this, "Type", key)}
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
    });
    
    return (
      <div className="AddItem">
        <h4>Add Item</h4>
        <div className="row">
          <div className="col-md-6">
            <div className="box">
              <AutoComplete
                  id="ProductName"
                  floatingLabelText="Product Name"
                  style={{width: "400px"}}
                  filter={AutoComplete.caseInsensitiveFilter}
                  dataSource={this.productNames}
              />
            </div>
          </div>
        </div>
        { product_properties_html }
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
