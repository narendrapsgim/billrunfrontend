import React, { Component } from 'react';
import moment from 'moment';
import Immutable from 'immutable';
import FontIcon from 'material-ui/FontIcon';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Field from '../Field';

export default class ProductPricePlanOverride extends Component {

  constructor(props) {
    super(props);
    this.onProductEditRate = this.onProductEditRate.bind(this);
  }

  onProductEditRate(key, path, e) {
    const { value }   = e.target;
    this.props.onProductEditRate(key, path, value);
  }

  tooltip(content){
    return (<Tooltip id="tooltip">{content}</Tooltip>);
  }

  shouldComponentUpdate(nextProps, nextState){
    return !Immutable.is(this.props.item, nextProps.item);
  }

  componentWillMount() {
    const { item, planName } = this.props;
    const usageType   = item.get('rates').keySeq().first();
    const ratePath    = ['rates', usageType, planName, 'rate'];
    // if product don't have pricing for this plan, init with BASE price
    if(typeof item.getIn(ratePath) === 'undefined'){
      this.props.onProductInitRate(item.get('key'), ratePath);
    }
  }

  componentWillUpdate(nextProps, nextState){
    const { item, planName } = nextProps;
    const usageType   = item.get('rates').keySeq().first();
    const ratePath    = ['rates', usageType, planName, 'rate'];
    const isRemoved   = (item.getIn(['uiflags', 'removed']) === true) ? true : false;
    const isEmpty     = (item.getIn(ratePath) && item.getIn(ratePath).size < 1) ? true : false;
    // If product don't have pricing in PLAN, set new empty one
    if(!isRemoved && isEmpty){
      this.props.onProductAddRate(item.get('key'), ratePath);
    }
  }

  render() {
    const { item, planName } = this.props;
    const usageType   = item.get('rates').keySeq().first();
    const ratePath    = ['rates', usageType, planName, 'rate'];
    const isRemoved   = (item.getIn(['uiflags', 'removed']) === true ) ? true : false;
    const isExisting  = (item.getIn(['uiflags', 'existing']) === true ) ? true : false;
    const itemKey     = item.get('key');

// {(isExisting) ? "delete" : "delete_forever"}


    return (
      <div style={{display: 'flex'}}>
        <div style={{flex: '2 0 0', margin: '20px 40px auto', textAlign: 'center'}}>
          {(isRemoved) ?
            <OverlayTrigger placement="bottom" overlay={this.tooltip("Undo Remove Rate")}>
               <i className="fa fa-mail-reply fa-lg" onClick={this.props.onProductUndoRemove.bind(null, itemKey, ['rates', usageType, planName])} style={{cursor: "pointer", color: 'green', marginTop: 35}} ></i>
            </OverlayTrigger>
            :
            <OverlayTrigger placement="bottom" overlay={this.tooltip((isExisting) ? "Mark to Remove Rate" : "Remove Rate")}>
               <i className="fa fa-minus-circle fa-lg" onClick={this.props.onProductRemove.bind(null, itemKey, ['rates', usageType, planName])} style={{cursor: "pointer", color: 'red', marginTop: 35}} ></i>
            </OverlayTrigger>
          }
          {(isExisting) ?
            <OverlayTrigger placement="bottom" overlay={this.tooltip("Restore Rate")}>
              <i className="fa fa-undo fa-lg" onClick={this.props.onProductRestore.bind(null, itemKey, ratePath)} style={{cursor: "pointer", color: 'yellow', marginTop: 35}} ></i>
            </OverlayTrigger>
             :
             <OverlayTrigger placement="bottom" overlay={this.tooltip("Restore Rate")}>
               <i className="fa fa-undo fa-lg" onClick={this.props.onNewProductRestore.bind(null, itemKey, ['rates', usageType, planName, 'rate'])} style={{cursor: "pointer", color: 'yellow', marginTop: 35}} ></i>
             </OverlayTrigger>
            }
        </div>
        <div style={{flex: '9 0 0'}}>
          <div className="product" style={{marginTop: 20}}>
              <div style={{display: 'flex' }} className={isRemoved ? 'product-removed' :'' }>
                <div style={{flex: '5 0 0', textAlign: 'left'}}>
                  <h4 style={{marginTop: 0}}>{item.get('key')} <small>&lt;{item.get('code')}&gt;</small></h4>
                  <p>{item.get('description')}</p>
                </div>
                <div style={{flex: '2 0 0', textAlign: 'right', pading: '0 3px'}}>
                  <p><strong>From: </strong>{moment(item.get('from')).format(globalSetting.dateFormat)}</p>
                  <p><strong>To: </strong>{moment(item.get('to')).format(globalSetting.dateFormat)}</p>
                </div>
              </div>
              { (!isRemoved && item.getIn(ratePath)) &&
                 item.getIn(ratePath).map((rate, key) => (
                  <div className="form-group" key={key}>
                    <div className="col-xs-2">
                      <label htmlFor={`from-${key}`}>From</label>
                      <Field id={`from-${key}`}
                             coll="Product"
                             onChange={this.onProductEditRate.bind(this, itemKey, [...ratePath, key, "from"])}
                             value={rate.get('from')}
                      />
                    </div>
                    <div className="col-xs-2">
                      <label htmlFor={`to-${key}`}>To</label>
                      <Field id={`to-${key}`}
                             coll="Product"
                             onChange={this.onProductEditRate.bind(this, itemKey, [...ratePath, key, "to"])}
                             value={rate.get('to')}
                      />
                    </div>
                    <div className="col-xs-2">
                      <label htmlFor={`interval-${key}`}>Interval</label>
                      <Field id={`interval-${key}`}
                             onChange={this.onProductEditRate.bind(this, itemKey, [...ratePath, key, "interval"])}
                             value={rate.get('interval')}
                      />
                    </div>
                    <div className="col-xs-4">
                      <label htmlFor={`price-${key}`}>Price</label>
                      <Field id={`price-${key}`}
                             fieldType="price"
                             onChange={this.onProductEditRate.bind(this, itemKey, [...ratePath, key, "price"])}
                             value={rate.get('price')}
                      />
                    </div>
                    <div className="col-xs-1">
                      { (key === (item.getIn(ratePath).size - 1)) &&
                           <OverlayTrigger placement="top" overlay={this.tooltip("Add interval")}>
                             <i className="fa fa-plus-circle fa-lg" onClick={this.props.onProductAddRate.bind(null, itemKey, ratePath)} style={{cursor: "pointer", color: 'green', marginTop: 35}} ></i>
                           </OverlayTrigger>
                       }
                     </div>
                     <div className="col-xs-1">
                      { (item.getIn(ratePath).size > 0 && key === (item.getIn(ratePath).size - 1) && key > 0) &&
                           <OverlayTrigger placement="top" overlay={this.tooltip("Remove interval")}>
                             <i className="fa fa-minus-circle fa-lg"  onClick={this.props.onProductRemoveRate.bind(null, itemKey, ratePath, key)} style={{cursor: "pointer", color: 'red', marginTop: 35}} ></i>
                           </OverlayTrigger>
                       }
                   </div>
                 </div>
               )) }
          </div>
        </div>
        <div style={{flex: '1 0 0'}}></div>
      </div>
    );
  }
}
