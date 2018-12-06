import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { Form, FormGroup, Row, Col, HelpBlock, Panel } from 'react-bootstrap';
import { CreateButton } from '../../Elements';
import {
  eventUsageTypesSelector,
  eventThresholdOperatorsSelectOptionsSelector,
  eventThresholdFieldsSelectOptionsSelector,
} from '../../../selectors/eventSelectors';
import { eventsSettingsSelector } from '../../../selectors/settingsSelector';
import FraudEventDetails from './FraudEventDetails';
import FraudEventCondition from './FraudEventCondition';
import FraudEventThreshold from './FraudEventThreshold';
import { getSettings } from '../../../actions/settingsActions';
import { getEventRates } from '../../../actions/eventActions';

class FraudEvent extends Component {

  static propTypes = {
    item: PropTypes.instanceOf(Immutable.Map),
    mode: PropTypes.string,
    eventsSettings: PropTypes.instanceOf(Immutable.Map),
    eventUsaget: PropTypes.instanceOf(Immutable.Set),
    thresholdFieldsSelectOptions: PropTypes.array,
    thresholdOperatorsSelectOptions: PropTypes.array,
    updateField: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    item: Immutable.Map(),
    mode: 'create',
    eventsSettings: Immutable.Map(),
    eventUsaget: Immutable.Set(),
    thresholdFieldsSelectOptions: [],
    thresholdOperatorsSelectOptions: [],
  };

  componentDidMount() {
    const { item } = this.props;
    const eventRates = item.getIn(['ui_flags', 'eventUsageType', 'arate_key'], Immutable.List());
    this.getEventRates(eventRates);
    this.props.dispatch(getSettings(['lines.fields']));
  }

  getEventRates = (eventRates) => {
    if (!eventRates.isEmpty()) {
      this.props.dispatch(getEventRates(eventRates));
    }
  }

  onChangeText = path => (e) => {
    const { value } = e.target;
    this.props.updateField(path, value);
  };

  onChangeSelect = path => (value) => {
    this.props.updateField(path, value);
  }

  onRemoveCondition = (index) => {
    const { item } = this.props;
    const conditions = item.getIn(['conditions', 0], Immutable.List()).delete(index);
    this.props.updateField(['conditions', 0], conditions);
  }

  onUpdateCondition = (path, value) => {
    this.props.updateField(['conditions', 0, ...path], value);
  }

  onChangeThreshold = (path, value) => {
    this.props.updateField(['threshold_conditions', 0, ...path], value);
  }

  setEventUsageType = (usageTypes) => {
    this.props.updateField(['ui_flags', 'eventUsageType'], usageTypes);
  }

  onAddCondition = () => {
    const { item } = this.props;
    const conditions = Immutable.List([
      ...item.getIn(['conditions', 0], Immutable.List()),
      Immutable.Map({ field: '', op: '', value: Immutable.List() }),
    ]);
    this.props.updateField(['conditions', 0], conditions);
  }

  renderConditions = () => {
    const { item } = this.props;
    const usedFields = item.getIn(['conditions', 0], Immutable.List()).map(condition => condition.get('field', ''));
    const eventUsageTypes = item.getIn(['ui_flags', 'eventUsageType'], Immutable.Map());
    const conditionsRows = item.getIn(['conditions', 0], Immutable.List()).map((condition, index) => (
      <FraudEventCondition
        key={`condition_0_${index}`}
        condition={condition}
        index={index}
        usedFields={usedFields}
        eventUsageTypes={eventUsageTypes}
        onUpdate={this.onUpdateCondition}
        onRemove={this.onRemoveCondition}
        setEventUsageType={this.setEventUsageType}
        getEventRates={this.getEventRates}
      />
    ));
    const disableAdd = false; // fieldsOptions.isEmpty();
    const disableCreateNewtitle = disableAdd ? 'No more filter options' : '';
    return (
      <Row className="report-editor-conditions">
        <Col sm={12}>
          { !conditionsRows.isEmpty() && (
            <FormGroup className="form-inner-edit-row">
              <Col sm={4} xsHidden><label htmlFor="field_field">Filter</label></Col>
              <Col sm={2} xsHidden><label htmlFor="operator_field">Operator</label></Col>
              <Col sm={4} xsHidden><label htmlFor="value_field">Value</label></Col>
            </FormGroup>
          )}
        </Col>
        <Col sm={12}>
          { conditionsRows }
        </Col>
        <Col sm={12}>
          <CreateButton
            onClick={this.onAddCondition}
            label="Add Condition"
            disabled={disableAdd}
            title={disableCreateNewtitle}
          />
        </Col>
      </Row>
    );
  }

  renderThreshold = () => {
    const {
      item,
      eventUsaget,
      thresholdFieldsSelectOptions,
      thresholdOperatorsSelectOptions,
    } = this.props;
    const index = 0;
    const threshold = item.getIn(['threshold_conditions', 0, index], Immutable.Map());
    return (
      <Col sm={12}>
        <FormGroup className="form-inner-edit-row">
          <Col sm={3} xsHidden><label htmlFor="threshold_field">Field</label></Col>
          <Col sm={3} xsHidden><label htmlFor="threshold_operator">Operator</label></Col>
          <Col sm={4} xsHidden><label htmlFor="threshold_value">Value</label></Col>
          {eventUsaget.size === 1 && (<Col sm={2} xsHidden><label htmlFor="threshold_uof">Unit of measure</label></Col>)}
        </FormGroup>
        <FraudEventThreshold
          threshold={threshold}
          index={index}
          eventUsaget={eventUsaget}
          thresholdFieldsSelectOptions={thresholdFieldsSelectOptions}
          thresholdOperatorsSelectOptions={thresholdOperatorsSelectOptions}
          onUpdate={this.onChangeThreshold}
        />
      </Col>
    );
  }

  render() {
    const { mode, item, eventsSettings } = this.props;
    return (
      <Form horizontal>
        <Panel header={<span>Details</span>}>
          <FraudEventDetails
            item={item}
            eventsSettings={eventsSettings}
            onUpdate={this.props.updateField}
          />
        </Panel>
        <Panel header={<span>Conditions</span>} collapsible defaultExpanded={['create', 'clone'].includes(mode)} className="collapsible">
          { this.renderConditions() }
        </Panel>
        <Panel header={<span>Threshold</span>}>
          { this.renderThreshold() }
        </Panel>
      </Form>
    );
  }
}

const mapStateToProps = (state, props) => ({
  eventUsaget: eventUsageTypesSelector(state, props),
  thresholdFieldsSelectOptions: eventThresholdFieldsSelectOptionsSelector(state, { ...props, eventType: 'fraud' }),
  thresholdOperatorsSelectOptions: eventThresholdOperatorsSelectOptionsSelector(null, { eventType: 'fraud' }),
  eventsSettings: eventsSettingsSelector(state, props),
});

export default connect(mapStateToProps)(FraudEvent);
