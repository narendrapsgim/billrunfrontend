import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { Panel } from 'react-bootstrap';
import Select from 'react-select';
import ChargingPlanInclude from './ChargingPlanInclude';

const ChargingPlanIncludes = (props) => {
  const editable = (props.mode !== 'view');
  return (
    <div className="ChargingPlanIncludes">
      { editable &&
        <Panel header={<h3>Select prepaid bucket</h3>}>
          <Select value="" options={props.prepaidIncludesOptions} onChange={props.onSelectPPInclude} />
        </Panel>
        }
      { editable && <hr /> }
      {
        props.includes
          .keySeq()
          .filter(inc => inc !== 'cost')
          .map((type, key) => (
            <ChargingPlanInclude
              key={key}
              editable={editable}
              include={props.includes.get(type)}
              onUpdateField={props.onUpdateField}
              onUpdatePeriodField={props.onUpdatePeriodField}
              type={type}
            />
          ))
      }
    </div>
  );
};

ChargingPlanIncludes.defaultProps = {
  includes: Map(),
  prepaidIncludesOptions: [],
  mode: 'create',
};

ChargingPlanIncludes.propTypes = {
  includes: PropTypes.instanceOf(Map),
  prepaidIncludesOptions: PropTypes.array,
  onSelectPPInclude: PropTypes.func.isRequired,
  onUpdatePeriodField: PropTypes.func.isRequired,
  mode: PropTypes.string,
};

export default connect()(ChargingPlanIncludes);
