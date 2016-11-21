import React from 'react';
import { connect } from 'react-redux';

import { Panel } from 'react-bootstrap';
import UsagetypeSelect from '../Plan/components/UsagetypeSelect';
import ChargingPlanInclude from './ChargingPlanInclude';

const ChargingPlanIncludes = (props) => {
  const { includes, prepaid_includes_options } = props;
  
  return (
    <div className="ChargingPlanIncludes">
      <Panel header={ <h3>Select usage type</h3> }>
        <UsagetypeSelect
            value=''
            onChangeUsageType={ props.onSelectUsaget }
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
