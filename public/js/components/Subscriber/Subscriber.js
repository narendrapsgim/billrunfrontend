import React, { Component } from 'react';
import { connect } from 'react-redux';

import Edit from './Edit';
import New from './New';
import Field from '../Field';

class Subscriber extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { newCustomer, items, settings, onChangeFieldValue, onUnsubscribe } = this.props;
    const view = newCustomer ? (<New settings={settings} onChange={onChangeFieldValue} />) : (<Edit items={items} settings={settings} onChange={onChangeFieldValue} />);
    
    return (
      <div className="Subscriber">
        { view }
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {items: state.subscriber.get('customer'),
          settings: state.subscriber.get('settings')};
}

export default connect(mapStateToProps)(Subscriber);
