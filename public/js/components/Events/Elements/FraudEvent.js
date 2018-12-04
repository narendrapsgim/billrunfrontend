import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { Form, FormGroup, Row, Col, HelpBlock, Panel } from 'react-bootstrap';
import { CreateButton } from '../../Elements';
// import {
//   usageTypesDataSelector,
//   propertyTypeSelector,
//   currencySelector,
// } from '../../../selectors/settingsSelector';
import FraudEventDetails from './FraudEventDetails';
import FraudEventCondition from './FraudEventCondition';
import FraudEventThreshold from './FraudEventThreshold';
import { getSettings } from '../../../actions/settingsActions';

class FraudEvent extends Component {

  static propTypes = {
    item: PropTypes.instanceOf(Immutable.Map),
    mode: PropTypes.string,

    // propertyTypes: PropTypes.instanceOf(Immutable.List),
    // usageTypesData: PropTypes.instanceOf(Immutable.List),
    // currency: PropTypes.string,

    updateField: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    item: Immutable.Map(),
    mode: 'create',
    thresholdOperatorsSelectOptions: Immutable.List(),
    thresholdFieldsSelectOptions: Immutable.List(),

    // propertyTypes: Immutable.List(),
    // usageTypesData: Immutable.List(),
    // currency: '',
  };

  componentDidMount() {
    this.props.dispatch(getSettings(['lines.fields']));
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
    const conditionsRows = item.getIn(['conditions', 0], Immutable.List()).map((condition, index) => (
      <FraudEventCondition
        key={`condition_0_${index}`}
        condition={condition}
        index={index}
        onUpdate={this.props.updateField}
        onRemove={this.onRemoveCondition}
      />
    ));
    const disableAdd = false; // fieldsOptions.isEmpty();
    const disableCreateNewtitle = disableAdd ? 'No more filter options' : '';
    return (
      <Row className="report-editor-conditions">
        <Col sm={12}>
          { !conditionsRows.isEmpty() ? (
            <FormGroup className="form-inner-edit-row">
              <Col sm={4} xsHidden><label htmlFor="field_field">Filter</label></Col>
              <Col sm={2} xsHidden><label htmlFor="operator_field">Operator</label></Col>
              <Col sm={4} xsHidden><label htmlFor="value_field">Value</label></Col>
            </FormGroup>
          ) : (
            <HelpBlock>Please add at least one condition</HelpBlock>
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
    const { item } = this.props;
    const index = 0;
    const threshold = item.getIn(['threshold_conditions', 0, index], Immutable.Map());
    return (
      <Col sm={12}>
        <FormGroup className="form-inner-edit-row">
          <Col sm={3} xsHidden><label htmlFor="threshold_field">Field</label></Col>
          <Col sm={3} xsHidden><label htmlFor="threshold_operator">Operator</label></Col>
          <Col sm={4} xsHidden><label htmlFor="threshold_value">Value</label></Col>
          <Col sm={2} xsHidden><label htmlFor="threshold_uof">Unit of measure</label></Col>
        </FormGroup>
        <FraudEventThreshold
          threshold={threshold}
          index={index}
          onUpdate={this.props.updateField}
        />
      </Col>
    );
  }

  render() {
    const { mode, item } = this.props;
    return (
      <Form horizontal>
        <Panel header={<span>Details</span>}>
          <FraudEventDetails item={item} onUpdate={this.props.updateField} />
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
  // propertyTypes: propertyTypeSelector(state, props),
  // usageTypesData: usageTypesDataSelector(state, props),
  // currency: currencySelector(state, props),
});

export default connect(mapStateToProps)(FraudEvent);
