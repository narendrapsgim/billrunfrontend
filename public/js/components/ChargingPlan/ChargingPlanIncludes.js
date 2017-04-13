import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';
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
          .filter(inc => (inc !== 'cost' && inc !== 'groups'))
          .map((index, key) => (
            <ChargingPlanInclude
              key={key}
              editable={editable}
              include={props.includes.get(index)}
              onUpdateField={props.onUpdateField}
              onUpdatePeriodField={props.onUpdatePeriodField}
              index={index}
            />
          ))
      }
    </div>
  );
};

ChargingPlanIncludes.defaultProps = {
  includes: List(),
  prepaidIncludesOptions: [],
  mode: 'create',
};

ChargingPlanIncludes.propTypes = {
  includes: PropTypes.instanceOf(List),
  prepaidIncludesOptions: PropTypes.array,
  onSelectPPInclude: PropTypes.func.isRequired,
  onUpdatePeriodField: PropTypes.func.isRequired,
  mode: PropTypes.string,
};

export default connect()(ChargingPlanIncludes);
