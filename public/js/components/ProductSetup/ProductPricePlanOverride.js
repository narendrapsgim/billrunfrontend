import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import Immutable from 'immutable';
import FontIcon from 'material-ui/FontIcon';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import Field from '../Field';

export default class ProductPricePlanOverride extends Component {
  constructor(props) {
    super(props);
    this.onProductRemove = this.onProductRemove.bind(this);
    this.onProductUndoRemove = this.onProductUndoRemove.bind(this);
    this.onProductAddRate = this.onProductAddRate.bind(this);
    this.onProductEditRate = this.onProductEditRate.bind(this);
    this.onProductRemoveRate = this.onProductRemoveRate.bind(this);

    this.state = { };
  }

  componentWillReceiveProps(nextProps){
    let { item } = nextProps;
    if(item.get('rates').size < 1){
      this.onProductAddRate(item.get('key'));
    }
  }
  shouldComponentUpdate(nextProps, nextState){
    return !Immutable.is(this.props.item, nextProps.item);
  }

  onProductAddRate(itemKey) {
    this.props.onProductAddRate(itemKey);
  }
  onProductEditRate(id, idx, itemKey, e) {
    const { value } = e.target;
    this.props.onProductEditRate(itemKey, id, idx, value);
  }
  onProductRemoveRate(idx, itemKey) {
    this.props.onProductRemoveRate(itemKey, idx);
  }
  onProductRemove(key) {
    this.props.onProductRemove(key);
  }
  onProductUndoRemove(key) {
    this.props.onProductUndoRemove(key);
  }

  tooltip(content){
    return (<Tooltip id="tooltip">{content}</Tooltip>);
  }

  render() {
    let { item } = this.props;
    let isRemoved = (item.get('removed') === true ) ? true : false;
    let itemKey = item.get('key');

    return (
      <div style={{display: 'flex'}}>
        <div style={{flex: '1 0 0', margin: '20px 40px auto', textAlign: 'right'}}>
          {(isRemoved) ?
            <OverlayTrigger placement="bottom" overlay={this.tooltip("Undo Remove Rate")}>
              <FontIcon onClick={this.onProductUndoRemove.bind(this, itemKey)} className="material-icons" style={{cursor: "pointer", color: 'green', fontSize: '32px'}}>undo</FontIcon>
            </OverlayTrigger>
            :
            <OverlayTrigger placement="bottom" overlay={this.tooltip("Remove Rate")}>
              <FontIcon onClick={this.onProductRemove.bind(this, itemKey)} className="material-icons" style={{cursor: "pointer", color: '#D9534F', fontSize: '32px'}}>delete_forever</FontIcon>
            </OverlayTrigger>
          }
        </div>
        <div style={{flex: '12 0 0'}}>
          <div className="product" style={{marginTop: 20}}>
              <div style={{display: 'flex' }} className={isRemoved ? 'product-removed' :'' }>
                <div style={{flex: '5 0 0', textAlign: 'left'}}>
                  <h4 style={{marginTop: 0}}>{item.get('key')} <small>&lt;{item.get('code')}&gt;</small></h4>
                  <p>{item.get('description')}</p>
                </div>
                <div style={{flex: '2 0 0', textAlign: 'right', pading: '0 3px'}}>
                  <p><strong>From: </strong>{moment(item.get('from').get('sec') * 1000).format(globalSetting.dateFormat)}</p>
                  <p><strong>To: </strong>{moment(item.get('to').get('sec') * 1000).format(globalSetting.dateFormat)}</p>
                </div>
              </div>
              { (!isRemoved) ? item.get('rates').map((rate, key) => (
                  <div className="form-group" key={key}>
                    <div className="col-xs-2">
                      <label htmlFor={`from-${key}`}>From</label>
                      <Field id={`from-${key}`}
                             coll="Product"
                             onChange={this.onProductEditRate.bind(this, "from", key, itemKey)}
                             value={rate.get('from')}
                      />
                    </div>
                    <div className="col-xs-2">
                      <label htmlFor={`to-${key}`}>To</label>
                      <Field id={`to-${key}`}
                             coll="Product"
                             onChange={this.onProductEditRate.bind(this, "to", key, itemKey)}
                             value={rate.get('to')}
                      />
                    </div>
                    <div className="col-xs-2">
                      <label htmlFor={`interval-${key}`}>Interval</label>
                      <Field id={`interval-${key}`}
                             onChange={this.onProductEditRate.bind(this, "interval", key, itemKey)}
                             value={rate.get('interval')}
                      />
                    </div>
                    <div className="col-xs-4">
                      <label htmlFor={`price-${key}`}>Price</label>
                      <Field id={`price-${key}`}
                             fieldType="price"
                             onChange={this.onProductEditRate.bind(this, "price", key, itemKey)}
                             value={rate.get('price')}
                      />
                    </div>
                    <div className="col-xs-2">
                      {(() => {  /* only show plus button if there is the last one */
                         if (key === (item.get('rates').size - 1)) {
                           return (
                             <OverlayTrigger placement="top" overlay={this.tooltip("Add interval")}>
                               <FontIcon onClick={this.onProductAddRate.bind(this, itemKey)} className="material-icons" style={{cursor: "pointer", color: 'green', fontSize: '24px', paddingRight: '3px', marginTop: '30px'}}>add_circle_outline</FontIcon>
                             </OverlayTrigger>
                           );
                         }
                       })()}
                      {(() => {  /* only show remove button if there is more than one interval and only for the last one */
                         if (item.get('rates').size > 0 && key === (item.get('rates').size - 1) && key > 0) {
                           return (
                             <OverlayTrigger placement="top" overlay={this.tooltip("Remove interval")}>
                               <FontIcon onClick={this.onProductRemoveRate.bind(this, key, itemKey)} className="material-icons" style={{cursor: "pointer", color: '#D9534F', fontSize: '24px'}}>remove_circle_outline</FontIcon>
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
