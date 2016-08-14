import React, { Component } from 'react';
import moment from 'moment';
import Immutable from 'immutable';
import FontIcon from 'material-ui/FontIcon';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import Field from '../Field';
import * as Colors from 'material-ui/styles/colors'


export default class ProductPricePlanOverride extends Component {

  constructor(props) {
    super(props);
    this.onProductEditRate = this.onProductEditRate.bind(this);
  }

  onProductEditRate(key, path, e) {
    const { value } = e.target;
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
    const ratePath = ['rates', item.get('rates').keySeq().first(), planName];
    // if product don't have pricing for this plan, init with BASE price
    if(typeof item.getIn(ratePath) === 'undefined'){
      this.props.onProductInitRate(item.get('key'), planName, item.get('rates').keySeq().first());
    }
  }

  componentWillUpdate(nextProps, nextState){
    const { item, planName } = nextProps;
    const ratePath  = ['rates', item.get('rates').keySeq().first(), planName, 'rate'];
    const isRemoved = (item.getIn(['uiflags', 'removed']) === true) ? true : false;
    const isEmpty   = (item.getIn(ratePath) && item.getIn(ratePath).size < 1) ? true : false;
    // If product don't have pricing in PLAN, set new empty one
    if(!isRemoved && isEmpty){
      this.props.onProductAddRate(item.get('key'), ratePath);
    }
  }

  render() {
    const { item, planName } = this.props;
    const ratePath    = ['rates', item.get('rates').keySeq().first(), planName, 'rate'];
    const isRemoved   = (item.getIn(['uiflags', 'removed']) === true ) ? true : false;
    const isExisting  = (item.getIn(['uiflags', 'existing']) === true ) ? true : false;
    const itemKey     = item.get('key');

    return (
      <div style={{display: 'flex'}}>
        <div style={{flex: '2 0 0', margin: '20px 40px auto', textAlign: 'center'}}>
          {(isRemoved) ?
            <OverlayTrigger placement="bottom" overlay={this.tooltip("Undo Remove Rate")}>
              <FontIcon onClick={this.props.onProductUndoRemove.bind(null, itemKey, ['rates', item.get('rates').keySeq().first(), planName])} className="material-icons" style={{cursor: "pointer", color: Colors.green300, fontSize: '32px', marginRight: '10px'}}>undo</FontIcon>
            </OverlayTrigger>
            :
            <OverlayTrigger placement="bottom" overlay={this.tooltip((isExisting) ? "Mark to Remove Rate" : "Remove Rate")}>
              <FontIcon onClick={this.props.onProductRemove.bind(null, itemKey, ['rates', item.get('rates').keySeq().first(), planName])} className="material-icons" style={{cursor: "pointer", color: Colors.red300, fontSize: '32px', marginRight: '10px'}}>{(isExisting) ? "delete" : "delete_forever"}</FontIcon>
            </OverlayTrigger>
          }
          {(isExisting) ?
            <OverlayTrigger placement="bottom" overlay={this.tooltip("Restore Rate")}>
              <FontIcon onClick={this.props.onProductRestore.bind(null, itemKey, ratePath)} className="material-icons" style={{cursor: "pointer", color: Colors.amber300, fontSize: '32px'}}>{"restore"}</FontIcon>
            </OverlayTrigger>
             :
             <OverlayTrigger placement="bottom" overlay={this.tooltip("Restore Rate")}>
               <FontIcon onClick={this.props.onNewProductRestore.bind(null, itemKey, planName, item.get('rates').keySeq().first())} className="material-icons" style={{cursor: "pointer", color: Colors.amber300, fontSize: '32px'}}>{"restore"}</FontIcon>
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
              { (!isRemoved && item.getIn(ratePath)) ? item.getIn(ratePath).map((rate, key) => (
                  <div className="form-group" key={key}>
                    <div className="col-xs-2">
                      <label htmlFor={`from-${key}`}>From</label>
                      <Field id={`from-${key}`}
                             coll="Product"
                             onChange={this.onProductEditRate.bind(this, itemKey, ratePath.concat(key, "from"))}
                             value={rate.get('from')}
                      />
                    </div>
                    <div className="col-xs-2">
                      <label htmlFor={`to-${key}`}>To</label>
                      <Field id={`to-${key}`}
                             coll="Product"
                             onChange={this.onProductEditRate.bind(this, itemKey, ratePath.concat(key, "to"))}
                             value={rate.get('to')}
                      />
                    </div>
                    <div className="col-xs-2">
                      <label htmlFor={`interval-${key}`}>Interval</label>
                      <Field id={`interval-${key}`}
                             onChange={this.onProductEditRate.bind(this, itemKey, ratePath.concat(key, "interval"))}
                             value={rate.get('interval')}
                      />
                    </div>
                    <div className="col-xs-4">
                      <label htmlFor={`price-${key}`}>Price</label>
                      <Field id={`price-${key}`}
                             fieldType="price"
                             onChange={this.onProductEditRate.bind(this, itemKey, ratePath.concat(key, "price"))}
                             value={rate.get('price')}
                      />
                    </div>
                    <div className="col-xs-2">
                      {(() => {  /* only show plus button if there is the last one */
                         if (key === (item.getIn(ratePath).size - 1)) {
                           return (
                             <OverlayTrigger placement="top" overlay={this.tooltip("Add interval")}>
                               <FontIcon onClick={this.props.onProductAddRate.bind(null, itemKey, ratePath)} className="material-icons" style={{cursor: "pointer", color: Colors.green300, fontSize: '24px', paddingRight: '3px', marginTop: '30px'}}>add_circle_outline</FontIcon>
                             </OverlayTrigger>
                           );
                         }
                       })()}
                      {(() => {  /* only show remove button if there is more than one interval and only for the last one */
                         if (item.getIn(ratePath).size > 0 && key === (item.getIn(ratePath).size - 1) && key > 0) {
                           return (
                             <OverlayTrigger placement="top" overlay={this.tooltip("Remove interval")}>
                               <FontIcon onClick={this.props.onProductRemoveRate.bind(null, itemKey, ratePath, key)} className="material-icons" style={{cursor: "pointer", color: Colors.red300, fontSize: '24px'}}>remove_circle_outline</FontIcon>
                             </OverlayTrigger>
                           );
                         }
                       })()}
                   </div>
                 </div>
               )) : '' }
          </div>
        </div>
        <div style={{flex: '1 0 0'}}></div>
      </div>
    );
  }
}
