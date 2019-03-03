import React, { Component } from 'react';
import Select from 'react-select';
import Immutable from 'immutable';
import { apiBillRun } from '../../../common/Api';
import { searchProductsByKeyAndUsagetQuery } from '../../../common/ApiQueries';


export default class ProductSearchByUsagetype extends Component {

  static defaultProps = {
    disabled: false,
    existingProducts: Immutable.List(),
    products: Immutable.List(),
    usages: Immutable.List(),
    plays: '',
  }

  static propTypes = {
    onChangeGroupRates: React.PropTypes.func.isRequired,
    usages: React.PropTypes.instanceOf(Immutable.List),
    disabled: React.PropTypes.bool,
    existingProducts: React.PropTypes.instanceOf(Immutable.List),
    products: React.PropTypes.instanceOf(Immutable.List),
    plays: React.PropTypes.string,
  }

  shouldComponentUpdate(nextProps) {
    const { disabled, usages, existingProducts, products } = this.props;
    return (nextProps.disabled !== disabled
          || !Immutable.is(nextProps.usages, usages)
          || !Immutable.is(nextProps.existingProducts, existingProducts)
          || nextProps.products !== products
    );
  }

  onChangeGroupRates = (productKeys) => {
    const productKeysList = (productKeys.length) ? productKeys.split(',') : [];
    this.props.onChangeGroupRates(Immutable.List(productKeysList));
  }

  findGroupRates = () => {
    const { usages, existingProducts, plays } = this.props;
    const notKeys = existingProducts.toArray();
    const query = searchProductsByKeyAndUsagetQuery(usages.toArray(), notKeys, plays);
    return apiBillRun(query)
      .then((success) => {
        const uniqueKeys = [...new Set(success.data[0].data.details.map(option => option.key))];
        return ({
          options: uniqueKeys.map(key => ({
            value: key,
            label: key,
          })),
          complete: true,
        });
      })
      .catch(() => ({ options: [] }));
  }

  render() {
    const { disabled, usages, products } = this.props;
    if (typeof usages === 'undefined') {
      return null;
    }
    const product = products.join(',');
    return (
      <Select
        value={product}
        onChange={this.onChangeGroupRates}
        asyncOptions={this.findGroupRates}
        cacheAsyncResults={true}
        autoload={true}
        multi={true}
        searchable={true}
        disabled={disabled}
        placeholder="Add product..."
        noResultsText="No products found."
        searchPromptText="Type product key to search"
      />
    );
  }
}
