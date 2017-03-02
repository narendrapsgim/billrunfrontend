import React from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';
import { Panel } from 'react-bootstrap';
import ProductSearch from '../Plan/components/ProductSearch';
import Products from '../Plan/components/Products';


const BlockedProducts = (props) => {
  const { plan, mode } = props;

  const editable = (mode !== 'view');
  const products = plan.get('disallowed_rates', List());
  const onRemoveProduct = (rate) => {
    props.onRemoveProduct(rate)
  }
  const onSelectProduct = (productKey) => {
    props.onSelectProduct(productKey)
  }
  return (
    <div className="BlockedProducts">
      <Panel header={<h3>Blocked products</h3>}>
        { !products.isEmpty()
          ? (<Products products={products} onRemoveProduct={onRemoveProduct} editable={editable} />)
          : (<p style={{ marginTop: 8 }}>No blocked products</p>)
        }
        { editable &&
          <div style={{ marginTop: 10, minWidth: 250, width: '100%', height: 42 }}>
            <ProductSearch onSelectProduct={onSelectProduct} />
          </div>
        }
      </Panel>
    </div>
  );
};

export default connect()(BlockedProducts);
