import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Map, List } from 'immutable';
import { Form, Panel } from 'react-bootstrap';
import Select from 'react-select';
import { getSymbolFromCurrency } from 'currency-symbol-map';
import BalanceThreshold from './BalanceThreshold';
import {
  getUnitLabel,
} from '../../common/Util';

const Thresholds = (props) => {
  const { plan, ppIncludes, mode, propertyTypes, usageTypesData, currency } = props;

  const editable = (mode !== 'view');

  const getPpInclude = ppId => ppIncludes.find(pp => pp.get('external_id', '') === parseInt(ppId)) || Map();

  const thresholdEl = (ppId, key) => {
    const ppInclude = getPpInclude(ppId);
    const name = ppInclude.get('name', '');
    const unit = ppInclude.get('charging_by_usaget_unit', false);
    const usaget = ppInclude.get('charging_by_usaget', '');
    const unitLabel = unit
      ? getUnitLabel(propertyTypes, usageTypesData, usaget, unit)
      : getSymbolFromCurrency(currency);
    return (
      <BalanceThreshold
        key={key}
        editable={editable}
        name={name}
        ppId={ppId}
        value={plan.getIn(['pp_threshold', ppId], 0)}
        onChange={props.onChangeThreshold}
        onRemove={props.onRemoveThreshold}
        unitLabel={unitLabel}
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
  currency: '',
  usageTypesData: List(),
  propertyTypes: List(),
  mode: 'create',
};

Thresholds.propTypes = {
  plan: PropTypes.instanceOf(Map),
  ppIncludes: PropTypes.instanceOf(List),
  currency: PropTypes.string,
  usageTypesData: PropTypes.instanceOf(List),
  propertyTypes: PropTypes.instanceOf(List),
  onChangeThreshold: PropTypes.func.isRequired,
  onRemoveThreshold: PropTypes.func.isRequired,
  onAddBalance: PropTypes.func.isRequired,
  mode: PropTypes.string,
};

export default connect()(Thresholds);
