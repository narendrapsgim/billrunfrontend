import React, { Component } from 'react';
import { Panel, Button } from 'react-bootstrap';
import classNames from 'classnames';
import Immutable from 'immutable';
import Help from '../../Help';
import CreateButton from '../../Elements/CreateButton';
import ProductPrice from '../../Product/components/ProductPrice';

export default class PlanProduct extends Component {

  static propTypes = {
    onProductInitRate: React.PropTypes.func.isRequired,
    onProductAddRate: React.PropTypes.func.isRequired,
    onProductEditRate: React.PropTypes.func.isRequired,
    onProductEditRateTo: React.PropTypes.func.isRequired,
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

  onProductEditRate = (index, fieldName, value) => {
    const { item, planName } = this.props;
    const productKey = item.get('key');
    const usageType = item.get('rates').keySeq().first();
    switch (fieldName) {
      case 'to': {
        const fieldPath = ['rates', usageType, planName, 'rate'];
        this.props.onProductEditRateTo(productKey, fieldPath, index, value);
      }
        break;

      default: {
        const fieldPath = ['rates', usageType, planName, 'rate', index, fieldName];
        this.props.onProductEditRate(productKey, fieldPath, value);
      }
    }
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
    const isLast      = ((count === 0) || (count-1 === index));
    const priceCount  = (item.getIn(productPath)) ? item.getIn(productPath, Immutable.List()).size : 0;

    const isRemovedClass = classNames({
      'product-removed': isRemoved,
    });

    const header = (
      <h3 className={isRemovedClass}>
        {item.get('key')} <i>{item.get('code')}</i><Help contents={item.get('description')}/>
        {(isRemoved)
          ? <Button onClick={this.onProductUndoRemove} bsSize="xsmall" className="pull-right" style={{ minWidth: 80 }}><i className="fa fa-mail-reply" />&nbsp;Undo</Button>
          : <Button onClick={this.onProductRemove} bsSize="xsmall" className="pull-right" style={{ minWidth: 80 }}><i className="fa fa-trash-o danger-red" />&nbsp;Remove</Button>
        }
        <Button onClick={this.onProductRestore} bsSize="xsmall" className="pull-right" style={{ marginRight: 10, minWidth: 80 }}><i className="fa fa-undo fa-lg" /> &nbsp;Restore </Button>
      </h3>
    );

    return (
      <Panel header={header}>
        { !isRemoved && priceCount && item.getIn(productPath).map( (price, i) =>
          <ProductPrice
            key={i}
            item={price}
            index={i}
            count={priceCount}
            onProductEditRate={this.onProductEditRate}
            onProductRemoveRate={this.onProductRemoveRate}
          />
        )}
        { !isRemoved && <div><br /><CreateButton onClick={this.onProductAddRate} label="Add New" /></div> }
      </Panel>
    );
  }
}
