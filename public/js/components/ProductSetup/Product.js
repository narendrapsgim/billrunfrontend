import React, { Component } from 'react';

import Field from '../Field';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import ContentAdd from 'material-ui/svg-icons/content/add';
import DateTimeField from '../react-bootstrap-datetimepicker/lib/DateTimeField';

export default class Product extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const product_type_options = ["Metered", "Tiered"].map((type, key) => (
      <option value={type} key={key}>{type}</option>
    ));

    const { productSettings,
            onChangeItemFieldValue,
            onAddProductProperties,
            onChangeItemSelectFieldValue,
            onRemoveProductProperties,
            processors } = this.props;

    const units = _.uniq(_.flatten(processors.map(processor => {
      return processor.get('rate_calculators').keySeq().map(unit => { return unit; });
    }).toJS()));

    const available_units =[(<option disabled value="-1" key={-1}>Select Unit</option>),
                            ...units.map((unit, key) => (
                              <option value={unit} key={key}>{unit}</option>
                            ))];
    return (
      <div className="AddProduct">
        <div className="row">
          <div className="col-md-3">
            <label htmlFor="key">Name</label>
            <Field id="key"
                   coll="Product"
                   onChange={onChangeItemFieldValue.bind(this, "key", -1)}
                   value={productSettings.key}
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="key">Code</label>
            <Field id="code"
                   coll="Product"
                   onChange={onChangeItemFieldValue.bind(this, "code", -1)}
                   value={productSettings.code}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <label htmlFor="description">Description</label>
            <Field id="description"
                   coll="Product"
                   onChange={onChangeItemFieldValue.bind(this, "description", -1)}
                   value={productSettings.description}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-3">
            <label htmlFor="unit">Unit Type</label>
            <select id="unit" className="form-control" onChange={onChangeItemSelectFieldValue.bind(this, "unit", -1)} value={productSettings.unit} defaultValue="-1">
              { available_units }
            </select>
          </div>
          {/* <div className="col-md-2">
          <label htmlFor="unit_price">Unit Price</label>
          <Field id="unit_price"
          onChange={onChangeItemFieldValue.bind(this, "unit_price", -1)}
          value={productSettings.unit_price} />
          </div> */}
        </div>
        <div className="row">
          <div className="col-md-2">
            <label>Valid From</label>
            <DateTimeField id="from" value={productSettings.from}  onChange={onChangeItemFieldValue.bind(this, "from")} />
          </div>
          <div className="col-md-2">
            <label>To</label>
            <DateTimeField id="to"   value={productSettings.to}    onChange={onChangeItemFieldValue.bind(this, "to")} />
          </div>
        </div>        
        <div className="row">
          <div className="col-xs-1">
            <button className="btn btn-primary" style={{marginTop: 10}} onClick={onAddProductProperties}>Add Charges</button>
          </div>
        </div>
        { productSettings.rates.map((rate, key) => (
              <div className="row" key={key}>
                <div className="col-md-1">
                  <label htmlFor="from">From</label>
                  <Field id="from"
                         coll="Product"
                         onChange={onChangeItemFieldValue.bind(this, "from", key)}
                         value={productSettings.rates[key].from}
                  />
                </div>
                <div className="col-md-1">
                  <label htmlFor="to">To</label>
                  <Field id="to"
                         coll="Product"
                         onChange={onChangeItemFieldValue.bind(this, "to", key)}
                         value={productSettings.rates[key].to}
                  />
                </div>
                <div className="col-md-1">
                  <label htmlFor="interval">Interval</label>
                  <Field id="interval"
                         onChange={onChangeItemFieldValue.bind(this, "interval", key)}
                         value={productSettings.rates[key].interval}
                  />
                </div>
                <div className="col-md-1">
                  <label htmlFor="price">Price</label>
                  <Field id="price"
                         onChange={onChangeItemFieldValue.bind(this, "price", key)}
                         value={productSettings.rates[key].price}
                  />
                </div>
                {(() => {  /* only show remove button if there is more than one interval and only for the last one */
                   if (productSettings.rates.length > 0 && key === (productSettings.rates.length - 1)) {
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
      </div>
    );
  }
}
