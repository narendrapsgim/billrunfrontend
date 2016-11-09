import React from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';

import { showWarning } from '../../actions/alertsActions';
import { Panel } from 'react-bootstrap';
import ProductSearch from '../Plan/components/ProductSearch';

const BlockedProducts = (props) => {
  const { plan } = props;

  return (
    <div className="BlockedProducts">
      <Panel header={ <h3>Select product</h3> }>
	<ProductSearch onSelectProduct={ product_key => props.onSelectProduct(product_key) } />
      </Panel>
      <Panel header={ <h3>Blocked products</h3> }>
	{
	  !plan.get('disallowed_rates', List()).size &&
	  <span>No blocked products</span>
	}
	{
	  plan.get('disallowed_rates', List())
	      .map(product => (
		{ product }
	      ))
	}
      </Panel>
    </div>
  );
};

export default connect()(BlockedProducts);
