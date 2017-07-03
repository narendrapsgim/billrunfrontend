import React, { Component, PropTypes } from 'react';
import { Panel, Button } from 'react-bootstrap';
import classNames from 'classnames';
import Immutable from 'immutable';
import Help from '../../Help';
import CreateButton from '../../Elements/CreateButton';
import ProductPrice from '../../Product/components/ProductPrice';

export default class PlanProduct extends Component {

  static propTypes = {
    onProductInitRate: PropTypes.func.isRequired,
    onProductAddRate: PropTypes.func.isRequired,
    onProductEditRate: PropTypes.func.isRequired,
    onProductEditRateTo: PropTypes.func.isRequired,
    onProductRemoveRate: PropTypes.func.isRequired,
    onProductRemove: PropTypes.func.isRequired,
    onProductRestore: PropTypes.func.isRequired,
    mode: PropTypes.string,
    usaget: PropTypes.string.isRequired,
    item: PropTypes.instanceOf(Immutable.Map),
    prices: PropTypes.instanceOf(Immutable.List),
  }

  static defaultProps = {
    item: Immutable.Map(),
    prices: Immutable.List(),
    mode: 'create',
  };

  componentWillMount() {
    const { item, usaget, prices } = this.props;
    this.addDefaultPriceIfNoPrice(item, usaget, prices);
  }

  shouldComponentUpdate(nextProps, nextState) { // eslint-disable-line no-unused-vars
    const { prices, mode } = this.props;
    return !Immutable.is(prices, nextProps.prices) || mode !== nextProps.mode;
  }

  componentWillUpdate(nextProps, nextState) { // eslint-disable-line no-unused-vars
    const { item, usaget, prices } = nextProps;
    this.addDefaultPriceIfNoPrice(item, usaget, prices);
  }

  addDefaultPriceIfNoPrice = (item, usaget, prices) => {
    // if product don't have pricing for this plan, init with BASE price
    if (prices.size === 0) {
      const productKey = item.get('key', '');
      const productPath = ['rates', productKey, usaget, 'rate'];
      this.props.onProductInitRate(item, productPath);
    }
  }

  onProductEditRate = (index, fieldName, value) => {
    const { item, usaget } = this.props;
    const productKey = item.get('key');
    switch (fieldName) {
      case 'to': {
        const fieldPath = ['rates', productKey, usaget, 'rate'];
        this.props.onProductEditRateTo(fieldPath, index, value);
      }
        break;

      default: {
        const fieldPath = ['rates', productKey, usaget, 'rate', index, fieldName];
        this.props.onProductEditRate(fieldPath, value);
      }
    }
  }

  onProductAddRate = () => {
    const { item, usaget } = this.props;
    const productKey  = item.get('key');
    const productPath = ['rates', productKey, usaget, 'rate'];
    this.props.onProductAddRate(productPath);
  }

  onProductRemoveRate = (index) => {
    const { item, usaget } = this.props;
    const productKey  = item.get('key');
    const productPath = ['rates', productKey, usaget, 'rate'];
    this.props.onProductRemoveRate(productPath, index);
  }

  onProductRemove = () => {
    const { item } = this.props;
    const productKey  = item.get('key');
    const productPath = ['rates'];
    this.props.onProductRemove(productPath, productKey);
  }

  onProductRestore = () => {
    const { item, usaget } = this.props;
    const productKey = item.get('key', '');
    const productPath = ['rates', productKey, usaget, 'rate'];
    this.props.onProductRestore(item, productPath);
  }

  render() {
    const { item, prices, usaget, mode } = this.props;
    const unit = prices.getIn([0, 'uom_display', 'range'], '');
    const editable = (mode !== 'view');
    const priceCount = prices.size;
    const header = (
      <h3>
        { `${item.get('key')} (${usaget}) `} <i>{item.get('code')}</i><Help contents={item.get('description')} />
        { editable && <Button onClick={this.onProductRemove} bsSize="xsmall" className="pull-right" style={{ minWidth: 80 }}><i className="fa fa-trash-o danger-red" />&nbsp;Remove</Button>}
        { editable && <Button onClick={this.onProductRestore} bsSize="xsmall" className="pull-right" style={{ marginRight: 10, minWidth: 80 }}><i className="fa fa-undo fa-lg" /> &nbsp;Restore </Button>}
      </h3>
    );

    return (
      <Panel header={header}>
        { prices.map((price, i) =>
          <ProductPrice
            key={i}
            item={price}
            index={i}
            mode={mode}
            count={priceCount}
            unit={unit}
            onProductEditRate={this.onProductEditRate}
            onProductRemoveRate={this.onProductRemoveRate}
          />
        )}
        { editable && <div><br /><CreateButton onClick={this.onProductAddRate} label="Add New" /></div> }
      </Panel>
    );
  }
}
