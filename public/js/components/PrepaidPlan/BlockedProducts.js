import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { Panel } from 'react-bootstrap';
import Select from 'react-select';
import { apiBillRun } from '../../common/Api';
import { getProductsKeysQuery } from '../../common/ApiQueries';

const BlockedProducts = (props) => {
  const { plan, mode } = props;

  const editable = (mode !== 'view');
  const products = plan.get('disallowed_rates', Immutable.List()).join(',');
  const findGroupRates = () => apiBillRun(getProductsKeysQuery({ key: 1, description: 1 }))
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

  return (
    <div className="BlockedProducts">
      <Panel header={<h3>Blocked products</h3>}>
        <Select
          value={products}
          onChange={props.onChangeBlockProduct}
          asyncOptions={findGroupRates}
          cacheAsyncResults={true}
          autoload={true}
          multi={true}
          searchable={true}
          disabled={!editable}
          placeholder="Add product..."
          noResultsText="No products found."
          searchPromptText="Type product key to search"
        />
      </Panel>
    </div>
  );
};

BlockedProducts.defaultProps = {
  plan: Immutable.Map(),
  mode: 'create',
  onChangeBlockProduct: () => {},
};

BlockedProducts.propTypes = {
  plan: PropTypes.instanceOf(Immutable.Map),
  mode: PropTypes.string,
  onChangeBlockProduct: PropTypes.func,
};

export default connect()(BlockedProducts);
