import React, { Component } from 'react';
import Immutable from 'immutable';

import Field from '../Field';
import DateTimeField from '../react-bootstrap-datetimepicker/lib/DateTimeField';
import Chips from '../Chips';
import Select from 'react-select';

export default class Product extends Component {
  constructor(props) {
    super(props);
  }

  productPrefixes() {
    const { product } = this.props;
    return product.getIn(['params', 'prefix']) ?
           product.getIn(['params', 'prefix']).toJS() :
           [];
  }
  
  render() {
    const { product,
            onChangeItemFieldValue,
            onAddProductProperties,
            onChangeItemSelectFieldValue,
            onRemoveProductProperties,
            onChangePrefix,
            onSelectUnit,
            unitTypes } = this.props;
    /* 
       const units = _.uniq(_.flatten(processors.map(processor => {
       return processor.get('rate_calculators').keySeq().map(unit => { return unit; });
       }).toJS()));
     */
    /* const available_units =[(<option disabled value="-1" key={-1}>Select Unit</option>),
       ...unitTypes.map((unit, key) => (
       <option value={unit.get('usaget')} key={key}>{unit.get('usaget')}</option>
       ))]; */
    const available_units = unitTypes.map((unit, key) => {
      return {value: unit.get('usaget'), label: unit.get('usaget')};
    }).toJS();

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
          <div className="col-xs-2">
            <label htmlFor="code">Code</label>
            <Field id="code"
                   coll="Product"
                   onChange={onChangeItemFieldValue.bind(this, "code", -1)}
                   value={product.get('code')}
            />
          </div>
        </div>
        <div className="form-group">
          <div className="col-xs-5">
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
            {/* <select id="unit" className="form-control" onChange={onChangeItemSelectFieldValue.bind(this, "unit", -1)} value={product.get('unit')} defaultValue="-1">
            { available_units }
            </select> */}
            <Select
                id="unit"
                options={available_units}
                allowCreate={true}
                value={product.get('unit')}
                onChange={onSelectUnit}
            />
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
          <div className="col-xs-3">
            <label>Valid From</label>
            <DateTimeField id="from" value={product.get('from')}  onChange={onChangeItemFieldValue.bind(this, "from")} />
          </div>
          <div className="col-xs-3">
            <label>To</label>
            <DateTimeField id="to"   value={product.get('to')}    onChange={onChangeItemFieldValue.bind(this, "to")} />
          </div>
        </div>
        <div className="form-group">
          <div className="col-xs-3">
            <label>Prefixes</label>
            <Chips items={this.productPrefixes()} onChange={onChangePrefix} />
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
              <div className="col-xs-2">
                <label htmlFor={`price-${key}`}>Price</label>
                <Field id={`price-${key}`}
                       fieldType="price"
                       onChange={onChangeItemFieldValue.bind(this, "price", key)}
                       value={rate.get('price')}
                />
              </div>
              {(() => {  /* only show remove button if there is more than one interval and only for the last one */
                 if (product.get('rates').size > 0 && key === (product.get('rates').size - 1)) {
                   return (
                     <div className="col-xs-2">
                       <a className="btn btn-danger" style={{marginTop: "30px", marginLeft: "15px"}} onClick={onRemoveProductProperties.bind(this, key)}>
                         Remove Interval
                       </a>
                     </div>
                   )
                 }
               })()}
            </div>
          )) }
            <div className="form-group">
              <div className="col-xs-1">
                <a className="btn btn-primary" style={{marginTop: 10}} onClick={onAddProductProperties}>Add Charges</a>
              </div>
            </div>
      </form>
    );
  }
}
