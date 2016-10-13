import React, { Component } from 'react';
import { Button, FormGroup, Col, Row, ControlLabel, HelpBlock, OverlayTrigger, Tooltip  } from 'react-bootstrap';
import classNames from 'classnames';
import moment from 'moment';
import Immutable from 'immutable';
import Field from '../../Field';
import ProductPrice from '../../Product/components/ProductPrice';

export default class PlanProduct extends Component {

  static propTypes = {
    onProductInitRate: React.PropTypes.func.isRequired,
    onProductAddRate: React.PropTypes.func.isRequired,
    onProductEditRate: React.PropTypes.func.isRequired,
    onProductRemoveRate: React.PropTypes.func.isRequired,
    onProductRestore: React.PropTypes.func.isRequired,
    onProductRemove: React.PropTypes.func.isRequired,
    onProductUndoRemove: React.PropTypes.func.isRequired,
    planName: React.PropTypes.string.isRequired,
    index: React.PropTypes.number.isRequired,
    count: React.PropTypes.number.isRequired,
    item: React.PropTypes.instanceOf(Immutable.Map),
  }

  shouldComponentUpdate(nextProps, nextState){
    //if count was changed and this is last item
    const isLastAdded = this.props.count < nextProps.count && this.props.index === (this.props.count - 1);
    const isLastremoved = this.props.count > nextProps.count && this.props.index === (this.props.count - 2);
    return !Immutable.is(this.props.item, nextProps.item) || this.props.index !== nextProps.index || isLastAdded || isLastremoved;
  }

  componentWillMount() {
    const { item, planName } = this.props;
    const usageType   = item.get('rates').keySeq().first();
    const productPath = ['rates', usageType, planName, 'rate'];
    // if product don't have pricing for this plan, init with BASE price
    if(typeof item.getIn(productPath) === 'undefined'){
      this.props.onProductInitRate(item.get('key'), productPath);
    }
  }

  componentWillUpdate(nextProps, nextState){
    const { item, planName } = nextProps;
    const usageType   = item.get('rates').keySeq().first();
    const productPath = ['rates', usageType, planName, 'rate'];
    const isRemoved   = (item.getIn(['uiflags', 'removed']) === true) ? true : false;
    const isEmpty     = (item.getIn(productPath) && item.getIn(productPath, Immutable.List()).size > 0 )  ? false : true;
    // If product don't have pricing in PLAN, set new empty one
    if(!isRemoved && isEmpty){
      this.props.onProductAddRate(item.get('key'), productPath);
    }
  }

  tooltip(content){
    return (<Tooltip id="tooltip">{content}</Tooltip>);
  }

  onProductEditRate = (index, fieldName, value) => {
    const { item, planName } = this.props;
    const productKey  = item.get('key');
    const usageType   = item.get('rates').keySeq().first();
    const fieldPath   = ['rates', usageType, planName, 'rate', index, fieldName];
    this.props.onProductEditRate(productKey, fieldPath, value)
  }

  onProductAddRate = () => {
    const { item, planName } = this.props;
    const productKey  = item.get('key');
    const usageType   = item.get('rates').keySeq().first();
    const productPath = ['rates', usageType, planName, 'rate'];
    this.props.onProductAddRate(productKey, productPath);
  }

  onProductRemoveRate = (index) => {
    const { item, planName } = this.props;
    const productKey  = item.get('key');
    const usageType   = item.get('rates').keySeq().first();
    const productPath = ['rates', usageType, planName, 'rate'];
    this.props.onProductRemoveRate(productKey, productPath, index);
  }

  onProductUndoRemove = () => {
    const { item, planName } = this.props;
    const productKey  = item.get('key');
    const usageType   = item.get('rates').keySeq().first();
    const productPath = ['rates', usageType, planName]
    this.props.onProductUndoRemove(productKey, productPath);
  }

  onProductRemove = () => {
    const { item, planName } = this.props;
    const productKey  = item.get('key');
    const usageType   = item.get('rates').keySeq().first();
    const productPath = ['rates', usageType, planName];
    const isExisting  = item.getIn(['uiflags', 'existing'], false);
    this.props.onProductRemove(productKey, productPath, isExisting);
  }

  onProductRestore = () => {
    const { item, planName } = this.props;
    const productKey  = item.get('key');
    const usageType   = item.get('rates').keySeq().first();
    const productPath = ['rates', usageType, planName, 'rate'];
    const isExisting  = item.getIn(['uiflags', 'existing'], false);
    this.props.onProductRestore(productKey, productPath, isExisting);
  }

  render() {
    const { item, planName, index, count } = this.props;
    const usageType   = item.get('rates').keySeq().first();
    const productPath = ['rates', usageType, planName, 'rate'];
    const isRemoved   = item.getIn(['uiflags', 'removed'], false);
    const isExisting  = item.getIn(['uiflags', 'existing'], false);
    const itemKey     = item.get('key');
    const isLast      = ((count === 0) || (count-1 === index));
    const priceCount  = (item.getIn(productPath)) ? item.getIn(productPath, Immutable.List()).size : 0;

    const btnRemoveClass = classNames({
      'fa': true,
      'fa-minus-circle' : isExisting,
      'fa-times-circle' : !isExisting,
      'fa-lg': true,
    });

    const contentClass = classNames({
      'product-removed': isRemoved,
    });

    return (
      <Row>

        <Col lg={1} md={1} sm={1} xs={1} className="text-center">
          {(isRemoved)
            ?
              <OverlayTrigger placement="bottom" overlay={this.tooltip('Undo Remove Rate')}>
                <i className="fa fa-mail-reply fa-lg" onClick={this.onProductUndoRemove} style={{cursor: 'pointer', color: 'green', marginTop: 15}} />
              </OverlayTrigger>
            :
              <OverlayTrigger placement="bottom" overlay={this.tooltip((isExisting) ? 'Mark to Remove Rate' : 'Remove Rate')}>
                <i className={btnRemoveClass} onClick={this.onProductRemove} style={{cursor: 'pointer', color: 'red', marginTop: 15}} />
              </OverlayTrigger>
          }
        </Col>

        <Col lg={1} md={1} sm={1} xs={1} className="text-center">
          <OverlayTrigger placement="bottom" overlay={this.tooltip('Restore Rate')}>
            <i className="fa fa-undo fa-lg" onClick={this.onProductRestore} style={{cursor: 'pointer', color: '#777 ', marginTop: 15}} />
          </OverlayTrigger>
        </Col>

        <Col lg={10} md={10} sm={10} xs={10}>
          <Row className={contentClass}>
            <Col lg={8} md={8}>
                <h4>{item.get('key')} <small>&lt;{item.get('code')}&gt;</small></h4>
                <p>{item.get('description')}</p>
            </Col>

            <Col lg={4} md={4}>
              <p className="text-right"><strong>From: </strong>{moment(item.get('from')).format(globalSetting.dateFormat)}</p>
              <p className="text-right"><strong>To: </strong>{moment(item.get('to')).format(globalSetting.dateFormat)}</p>
            </Col>
          </Row>

          <Row>
            <Col lg={12} md={12}>
              { (!isRemoved && priceCount) ?
                  item.getIn(productPath).map( (price, i) =>
                    <ProductPrice key={i} item={price}
                        index={i}
                        count={priceCount}
                        onProductEditRate={this.onProductEditRate}
                        onProductRemoveRate={this.onProductRemoveRate}
                    />
                  )
                : null
              }
              </Col>
              <Col lg={12} md={12}>
              { !isRemoved && <Button bsSize="xsmall" className="btn-primary" onClick={this.onProductAddRate}><i className="fa fa-plus" />&nbsp;Add New</Button> }
            </Col>
          </Row>
        </Col>

        { !isLast && <Col lg={12} md={12} sm={12} xs={12}><hr /></Col> }
      </Row>
    );
  }
}
