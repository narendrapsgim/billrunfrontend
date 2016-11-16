import React from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';

import { showWarning } from '../../actions/alertsActions';
import { Panel, FormGroup, Col, ControlLabel } from 'react-bootstrap';
import ProductSearch from '../Plan/components/ProductSearch';
import Products from '../Plan/components/Products';

const BlockedProducts = (props) => {
  const { plan } = props;
  
  return (
    <div className="BlockedProducts">
      <Panel header={ <h3>Blocked products</h3> }>
	{
	  plan.get('disallowed_rates', List()).size
	  ? <Products products={ plan.get('disallowed_rates', List()) }
		      onRemoveProduct={ rate => props.onRemoveProduct(rate) } />
	  : <p style={{marginTop: 8}}>No blocked products</p>
	}
	<div style={{ marginTop: 10, minWidth: 250, width: '100%', height: 42 }}>
	  <ProductSearch onSelectProduct={ product_key => props.onSelectProduct(product_key) } />
	</div>
      </Panel>
    </div>
  );
};

export default connect()(BlockedProducts);
