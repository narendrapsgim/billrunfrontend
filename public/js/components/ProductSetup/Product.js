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
      <form className="form-horizontal AddProduct">
        <div className="form-group">
          <div className="col-xs-3">
            <label htmlFor="key">Name</label>
            <Field id="key"
                   coll="Product"
                   onChange={onChangeItemFieldValue.bind(this, "key", -1)}
                   value={product.get('key')}
            />
          </div>
          <div className="col-xs-3">
            <label htmlFor="code">Code</label>
            <Field id="code"
                   coll="Product"
                   onChange={onChangeItemFieldValue.bind(this, "code", -1)}
                   value={product.get('code')}
            />
          </div>
        </div>
        <div className="form-group">
          <div className="col-xs-6">
            <label htmlFor="description">Description</label>
            <Field id="description"
                   coll="Product"
                   onChange={onChangeItemFieldValue.bind(this, "description", -1)}
                   value={product.get('description')}
            />
          </div>
        </div>
        <div className="form-group">
          <div className="col-xs-3">
            <label htmlFor="unit">Unit Type</label>
            <select id="unit" className="form-control" onChange={onChangeItemSelectFieldValue.bind(this, "unit", -1)} value={product.get('unit')} defaultValue="-1">
              { available_units }
            </select>
          </div>
        </div>
        <div className="form-group">
          <div className="col-xs-3">
            <div className="checkbox">
              <label>
                <input type="checkbox" id="vatable" onChange={onChangeItemFieldValue.bind(this, "vatable", -1)} />VATable
              </label>
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="col-xs-2">
            <label>Valid From</label>
            <DateTimeField id="from" value={product.get('from')}  onChange={onChangeItemFieldValue.bind(this, "from")} />
          </div>
          <div className="col-xs-2">
            <label>To</label>
            <DateTimeField id="to"   value={product.get('to')}    onChange={onChangeItemFieldValue.bind(this, "to")} />
          </div>
        </div>        
        <div className="form-group">
          <div className="col-xs-1">
            <button className="btn btn-primary" style={{marginTop: 10}} onClick={onAddProductProperties}>Add Charges</button>
          </div>
        </div>
        { product.get('rates').map((rate, key) => (
              <div className="form-group" key={key}>
                <div className="col-xs-1">
                  <label htmlFor={`from-${key}`}>From</label>
                  <Field id={`from-${key}`}
                         coll="Product"
                         onChange={onChangeItemFieldValue.bind(this, "from", key)}
                         value={rate.get('from')}
                  />
                </div>
                <div className="col-xs-1">
                  <label htmlFor={`to-${key}`}>To</label>
                  <Field id={`to-${key}`}
                         coll="Product"
                         onChange={onChangeItemFieldValue.bind(this, "to", key)}
                         value={rate.get('to')}
                  />
                </div>
                <div className="col-xs-1">
                  <label htmlFor={`interval-${key}`}>Interval</label>
                  <Field id={`interval-${key}`}
                         onChange={onChangeItemFieldValue.bind(this, "interval", key)}
                         value={rate.get('interval')}
                  />
                </div>
                <div className="col-xs-1">
                  <label htmlFor={`price-${key}`}>Price</label>
                  <Field id={`price-${key}`}
                         onChange={onChangeItemFieldValue.bind(this, "price", key)}
                         value={rate.get('price')}
                  />
                </div>
                {(() => {  /* only show remove button if there is more than one interval and only for the last one */
                   if (product.get('rates').size > 0 && key === (product.get('rates').size - 1)) {
                     return (
                       <div className="col-xs-2">
                         <button className="btn btn-danger" style={{marginTop: "30px", marginLeft: "15px"}} onClick={onRemoveProductProperties.bind(this, key)}>
                           Remove Interval
                         </button>
                       </div>
                     )
                   }
                 })()}
              </div>
          )) }
      </form>
    );
  }
}
