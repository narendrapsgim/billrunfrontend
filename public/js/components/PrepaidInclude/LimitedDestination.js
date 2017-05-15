import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';
import { Panel } from 'react-bootstrap';
import Select from 'react-select';
import Actions from '../Elements/Actions';

const LimitedDestination = ({ name, rates, allRates, onChange, onRemove, editable }) => {
  const onChangeValue = (value) => {
    onChange(name, List(value.split(',')));
  };

  const onRemoveClick = () => {
    onRemove(name);
  };

  const actions = [
    { type: 'remove', showIcon: true, onClick: onRemoveClick },
  ];

  const renderPanelHeader = () => (
    <div>
      { name }
      <div className="pull-right" style={{ marginTop: -5 }}>
        <Actions actions={actions} />
      </div>
    </div>
  );

  return (
    <div className="LimitedDestination">
      <Panel header={renderPanelHeader()}>
        { editable
          ?
            <div>
              <Select
                multi={true}
                value={rates.join(',')}
                options={allRates}
                onChange={onChangeValue}
              />
            </div>
          : <div className="non-editable-field">{rates.join(',')}</div>
        }
      </Panel>
    </div>
  );
};

LimitedDestination.defaultProps = {
  name: '',
  rates: List(),
  allRates: [],
  actions: [],
  editable: true,
};

LimitedDestination.propTypes = {
  name: PropTypes.string,
  rates: PropTypes.instanceOf(List),
  allRates: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  editable: PropTypes.bool,
};

export default connect()(LimitedDestination);
