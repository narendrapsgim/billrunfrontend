import React, { Component } from 'react';

import Field from '../Field';
import DateTimeField from '../react-bootstrap-datetimepicker/lib/DateTimeField';

export default class Product extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const product_type_options = ["Metered", "Tiered"].map((type, key) => (
      <option value={type} key={key}>{type}</option>
    ));

    const { product,
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
                   value={product.get('key')}
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="key">Code</label>
            <Field id="code"
                   coll="Product"
                   onChange={onChangeItemFieldValue.bind(this, "code", -1)}
                   value={product.get('code')}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <label htmlFor="description">Description</label>
            <Field id="description"
                   coll="Product"
                   onChange={onChangeItemFieldValue.bind(this, "description", -1)}
                   value={product.get('description')}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-3">
            <label htmlFor="unit">Unit Type</label>
            <select id="unit" className="form-control" onChange={onChangeItemSelectFieldValue.bind(this, "unit", -1)} value={product.get('unit')} defaultValue="-1">
              { available_units }
            </select>
          </div>
        </div>
        <div className="row">
          <div className="col-md-2">
            <label>Valid From</label>
            <DateTimeField id="from" value={product.get('from')}  onChange={onChangeItemFieldValue.bind(this, "from")} />
          </div>
          <div className="col-md-2">
            <label>To</label>
            <DateTimeField id="to"   value={product.get('to')}    onChange={onChangeItemFieldValue.bind(this, "to")} />
          </div>
        </div>        
        <div className="row">
          <div className="col-xs-1">
            <button className="btn btn-primary" style={{marginTop: 10}} onClick={onAddProductProperties}>Add Charges</button>
          </div>
        </div>
        { product.get('rates').map((rate, key) => (
              <div className="row" key={key}>
                <div className="col-md-1">
                  <label htmlFor="from">From</label>
                  <Field id="from"
                         coll="Product"
                         onChange={onChangeItemFieldValue.bind(this, "from", key)}
                         value={rate.get('from')}
                  />
                </div>
                <div className="col-md-1">
                  <label htmlFor="to">To</label>
                  <Field id="to"
                         coll="Product"
                         onChange={onChangeItemFieldValue.bind(this, "to", key)}
                         value={rate.get('to')}
                  />
                </div>
                <div className="col-md-1">
                  <label htmlFor="interval">Interval</label>
                  <Field id="interval"
                         onChange={onChangeItemFieldValue.bind(this, "interval", key)}
                         value={rate.get('interval')}
                  />
                </div>
                <div className="col-md-1">
                  <label htmlFor="price">Price</label>
                  <Field id="price"
                         onChange={onChangeItemFieldValue.bind(this, "price", key)}
                         value={rate.get('price')}
                  />
                </div>
                {(() => {  /* only show remove button if there is more than one interval and only for the last one */
                   if (product.get('rates').size > 0 && key === (product.get('rates').size - 1)) {
                     return (
                       <div className="col-md-2">
                         <button className="btn btn-danger" style={{marginTop: "30px", marginLeft: "15px"}} onClick={onRemoveProductProperties.bind(this, key)}>
                           Remove Interval
                         </button>
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
