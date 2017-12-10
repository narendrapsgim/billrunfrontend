import React, { Component } from 'react';
import Select from 'react-select';
import { apiBillRun } from '../../../common/Api';
import { getProductsKeysQuery } from '../../../common/ApiQueries';


export default class ProductSearch extends Component {

  static propTypes = {
    onSelectProduct: React.PropTypes.func.isRequired,
  }

  state = { val: '' }

  onSelectProduct = (productKey) => {
    if (productKey) {
      this.props.onSelectProduct(productKey);
    }
    this.setState({ val: '' });
  }

  getProducts = () => apiBillRun(getProductsKeysQuery({ key: 1, description: 1 }))
    .then(success => ({
      options: success.data[0].data.details.map(option => ({
        value: option.key,
        label: `${option.key} (${option.description})`,
      })),
      complete: true,
    }))
    .catch(() => ({ options: [] }));

  render() {
    const { val } = this.state;
    return (
      <Select
        value={val}
        onChange={this.onSelectProduct}
        asyncOptions={this.getProducts}
        autoload={true}
        searchable={true}
        placeholder="Search by product key or title..."
        noResultsText="No products found, please try another key"
      />
    );
  }
}
