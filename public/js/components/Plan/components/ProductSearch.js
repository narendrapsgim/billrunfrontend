import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import { apiBillRun } from '../../../common/Api';
import { getProductsKeysQuery } from '../../../common/ApiQueries';


export default class ProductSearch extends Component {

  static propTypes = {
    onSelectProduct: PropTypes.func.isRequired,
    searchFunction: PropTypes.object,
    filterFunction: PropTypes.func,
  }

  static defaultProps = {
    searchFunction: getProductsKeysQuery({ key: 1, description: 1 }),
    filterFunction: () => true,
  };


  state = {
    val: '',
    rates: [],
  }

  onSelectProduct = (productKey) => {
    if (productKey) {
      this.props.onSelectProduct(productKey);
    }
    this.setState({ val: '' });
  }

  componentDidMount() {
    this.getProducts();
  }

  getProducts = () => apiBillRun(this.props.searchFunction)
    .then((success) => {
      const options = success.data[0].data.details
      .map(option => ({
        value: option.key,
        label: `${option.key} (${option.description})`,
        play: option.play,
      }));
      this.setState({ rates: options });
    })
    .catch(() => {
      this.setState({ options: [] });
    });

  render() {
    const { val, rates } = this.state;
    const ratesOptions = rates.filter(this.props.filterFunction);
    return (
      <Select
        value={val}
        options={ratesOptions}
        onChange={this.onSelectProduct}
        searchable={true}
        placeholder="Search by product key or title..."
        noResultsText="No products found, please try another key"
      />
    );
  }
}
