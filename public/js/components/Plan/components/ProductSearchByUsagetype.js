import React, { Component } from 'react';
import Select from 'react-select';
import Immutable from 'immutable';
import { apiBillRun } from '../../../common/Api';
import { searchProductsByKeyAndUsagetQuery } from '../../../common/ApiQueries';


export default class ProductSearchByUsagetype extends Component {

  static defaultProps = {
    disabled: false,
    products: Immutable.List(),
  }

  static propTypes = {
    addRatesToGroup: React.PropTypes.func.isRequired,
    usaget: React.PropTypes.string.isRequired,
    disabled: React.PropTypes.bool,
    products: React.PropTypes.instanceOf(Immutable.List),
  }

  state = { val: null };

  shouldComponentUpdate(nextProps, nextState) {
    const { disabled, usaget, products } = this.props;
    const { val } = this.state;

    return (nextProps.disabled !== disabled
          || nextProps.usaget !== usaget
          || !Immutable.is(nextProps.products, products)
          || nextState.val !== val
    );
  }

  addRatesToGroup = (productKey) => {
    if (productKey) {
      this.props.addRatesToGroup(productKey);
    }
    this.setState({ val: '' });
  }

  findGroupRates = (input) => {
    if (input && input.length) {
      const { usaget, products } = this.props;
      const key = input.toLowerCase();
      const notKeys = products.toArray();
      const query = searchProductsByKeyAndUsagetQuery(usaget, key, notKeys);
      return apiBillRun(query)
      .then(success => ({ options: success.data[0].data.details }))
      .catch(() => ({ options: [] }));
    }
    return Promise.resolve({ options: [] });
  }

  render() {
    const { disabled, usaget } = this.props;
    const { val } = this.state;
    if (typeof usaget === 'undefined') {
      return null;
    }
    return (
      <Select
        value={val}
        onChange={this.addRatesToGroup}
        asyncOptions={this.findGroupRates}
        cacheAsyncResults={false}
        searchable={true}
        autoload={false}
        disabled={disabled}
        valueKey="key"
        labelKey="key"
        placeholder="Add product..."
        noResultsText="No products found."
        searchPromptText="Type product key to search"
      />
    );
  }
}
