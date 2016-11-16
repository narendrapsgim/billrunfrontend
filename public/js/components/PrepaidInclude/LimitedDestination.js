import React from 'react';
import { connect } from 'react-redux';

import { Panel } from 'react-bootstrap';
import Select from 'react-select';

class LimitedDestination extends React.Component {
  constructor(props) {
    super(props);
  }

  onChange = (value) => {
    this.props.onChange(this.props.name, value.split(','));
  };

  render() {
    const { name, rates, allRates } = this.props;
    return (
      <div className="LimitedDestination">
        <Panel header={ <h3>{ name }</h3> }>
          <Select multi={ true }
                  value={ rates.join(',') }
                  options={ allRates }
                  onChange={ this.onChange } />
        </Panel>
      </div>
    );
  }
}

export default connect()(LimitedDestination);
