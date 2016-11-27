import React from 'react';
import { connect } from 'react-redux';

import { Panel } from 'react-bootstrap';
import Select from 'react-select';
import ChargingPlanInclude from './ChargingPlanInclude';

const ChargingPlanIncludes = (props) => {
  const { includes, prepaid_includes_options } = props;
  
  return (
    <div className="ChargingPlanIncludes">
      <Panel header={ <h3>Select prepaid bucket</h3> }>
        <Select
            value=''
            options={ prepaid_includes_options }
            onChange={ props.onSelectPPInclude }
        />
      </Panel>
      <hr/>
      {
        includes.keySeq()
                .filter(inc => inc !== 'cost')
                .map((type, key) => (
                  <ChargingPlanInclude
                      key={ key }
                      prepaid_includes_options={ prepaid_includes_options }
                      include={ includes.get(type) }
                      onUpdateField={ props.onUpdateField }
                      onUpdatePeriodField={ props.onUpdatePeriodField }
                      type={ type }
                  />
                ))
      }
    </div>
  );
};

export default connect()(ChargingPlanIncludes);
