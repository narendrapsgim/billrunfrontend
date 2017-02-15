import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Map, List } from 'immutable';
import { Form, Panel } from 'react-bootstrap';
import Select from 'react-select';
import BalanceThreshold from './BalanceThreshold';

const Thresholds = (props) => {
  const { plan, ppIncludes } = props;

  const ppIncludeName = (ppId) => {
    const ppInclude = ppIncludes.find(pp => pp.get('external_id', '') === parseInt(ppId), Map());
    return (ppInclude) ? ppInclude.get('name', '') : '';
  };

  const thresholdEl = (ppId, key) => {
    const name = ppIncludeName(ppId);
    return (
      <BalanceThreshold
        key={key}
        name={name}
        pp_id={ppId}
        value={plan.getIn(['pp_threshold', ppId], 0)}
        onChange={props.onChangeThreshold}
      />
    );
  };

  const options = ppIncludes.map(pp => ({
    value: pp.get('external_id').toString(),
    label: pp.get('name'),
  })).toJS();

  return (
    <div className="Thresholds">
      <Form horizontal>
        <Panel header={<h3>Select prepaid bucket</h3>}>
          <Select placeholder="Select" options={options} onChange={props.onAddBalance} />
        </Panel>
        <hr />
        <Panel>
          {
            plan.get('pp_threshold', Map())
              .keySeq().filter(i => i !== 'on_load')
              .map(thresholdEl)
          }
        </Panel>
      </Form>
    </div>
  );
};

Thresholds.defaultProps = {
  plan: Map(),
  ppIncludes: List(),
};

Thresholds.propTypes = {
  plan: PropTypes.instanceOf(Map),
  ppIncludes: PropTypes.instanceOf(List),
  onChangeThreshold: PropTypes.func.isRequired,
  onAddBalance: PropTypes.func.isRequired,
};

export default connect()(Thresholds);
