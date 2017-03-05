import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Map, List } from 'immutable';
import { Form, Panel } from 'react-bootstrap';
import Select from 'react-select';
import BalanceThreshold from './BalanceThreshold';

const Thresholds = (props) => {
  const { plan, ppIncludes, mode } = props;

  const editable = (mode !== 'view');

  const ppIncludeName = (ppId) => {
    const ppInclude = ppIncludes.find(pp => pp.get('external_id', '') === parseInt(ppId), Map());
    return (ppInclude) ? ppInclude.get('name', '') : '';
  };

  const thresholdEl = (ppId, key) => {
    const name = ppIncludeName(ppId);
    return (
      <BalanceThreshold
        key={key}
        editable={editable}
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

  const thresholds = plan.get('pp_threshold', Map());

  return (
    <div className="Thresholds">
      <Form horizontal>
        { editable &&
          <Panel header={<h3>Select prepaid bucket</h3>}>
            <Select placeholder="Select" options={options} onChange={props.onAddBalance} />
          </Panel>
        }
        { editable && <hr /> }
        <Panel>
          { !thresholds.isEmpty()
            ? thresholds.keySeq().filter(i => i !== 'on_load').map(thresholdEl)
            : (<p>No charging limits</p>)
          }
        </Panel>
      </Form>
    </div>
  );
};

Thresholds.defaultProps = {
  plan: Map(),
  ppIncludes: List(),
  mode: 'create',
};

Thresholds.propTypes = {
  plan: PropTypes.instanceOf(Map),
  ppIncludes: PropTypes.instanceOf(List),
  onChangeThreshold: PropTypes.func.isRequired,
  onAddBalance: PropTypes.func.isRequired,
  mode: PropTypes.string,
};

export default connect()(Thresholds);
