import React, { Component } from 'react';
import Select from 'react-select';
import { apiBillRun } from '../../../common/Api';
import { searchProductsByKeyQuery } from '../../../common/ApiQueries';


export default class ProductSearch extends Component {

  static propTypes = {
    onSelectProduct: React.PropTypes.func.isRequired,
  }

  state = { val: null }

  onSelectProduct = (productKey) => {
    if (productKey) {
      this.props.onSelectProduct(productKey);
    }
    this.setState({ val: null });
  }

  getProducts = (input) => {
    if (input && input.length) {
      const key = input.toLowerCase();
      const query = searchProductsByKeyQuery(key, { key: 1 });
      return apiBillRun(query)
        .then(success => ({ options: success.data[0].data.details }))
        .catch(() => ({ options: [] }));
    }
    return Promise.resolve({ options: [] });
  }

  render() {
    return (
      <Select
        value={this.state.val}
        cacheAsyncResults={false}
        onChange={this.onSelectProduct}
        asyncOptions={this.getProducts}
        valueKey="key"
        labelKey="key"
        placeholder="Search by product key..."
        noResultsText="No products found, please try another key"
      />
    );
  }
}
