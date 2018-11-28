import React, { PropTypes, Component } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { Form, FormGroup, Col, ControlLabel, Button, Panel } from 'react-bootstrap';
import { getConditionDescription } from './EventsUtil';
import Field from '../Field';
import ConditionBalance from './ConditionsTypes/ConditionBalance';
import { usageTypesDataSelector, propertyTypeSelector, currencySelector } from '../../selectors/settingsSelector';

class EventBalanceForm extends Component {

  static propTypes = {
    item: PropTypes.instanceOf(Immutable.Map),
    updateField: PropTypes.func.isRequired,
    conditionType: PropTypes.string,
    propertyTypes: PropTypes.instanceOf(Immutable.List),
    usageTypesData: PropTypes.instanceOf(Immutable.List),
    currency: PropTypes.string,
  };

  static defaultProps = {
    item: Immutable.Map(),
    conditionType: 'balance',
    propertyTypes: Immutable.List(),
    usageTypesData: Immutable.List(),
    currency: '',
  };

  state = {
    editedConditionIndex: -1,
  };

  onChangeField = path => (e) => {
    const { value } = e.target;
    this.props.updateField(path, value);
  };

  addCondition = () => {
    const { item } = this.props;
    const conditions = item.get('conditions', Immutable.List()).push(Immutable.Map());
    this.props.updateField(['conditions'], conditions);
    this.setState({
      editedConditionIndex: conditions.size - 1,
    });
  };

  editCondition = index => () => {
    this.setState({
      editedConditionIndex: index,
    });
  }

  hideEditCondition = () => {
    this.setState({
      editedConditionIndex: -1,
    });
  }

  removeCondition = index => () => {
    const { item } = this.props;
    const conditions = item.get('conditions', Immutable.List()).delete(index);
    this.props.updateField(['conditions'], conditions);
  };

  renderConditionEditForm = (condition, index) => {
    const { conditionType, propertyTypes, usageTypesData } = this.props;
    switch (conditionType) {
      case 'balance':
      default:
        return (
          <ConditionBalance
            item={condition}
            index={index}
            onChangeField={this.props.updateField}
            propertyTypes={propertyTypes}
            usageTypesData={usageTypesData}
          />
        );
    }
  }

  renderCondition = (condition, index) => (
    <FormGroup className="form-inner-edit-row" key={index}>
      <Col sm={10}>
        {
          getConditionDescription(this.props.conditionType, condition, {
            propertyTypes: this.props.propertyTypes,
            usageTypesData: this.props.usageTypesData,
            currency: this.props.currency,
            activityType: 'counter',
          })
        }
      </Col>
      <Col sm={1} hidden={this.state.editedConditionIndex === index}>
        <Button onClick={this.editCondition(index)} bsStyle="link">
          <i className="fa fa-fw fa-pencil" />
        </Button>
      </Col>
      <Col sm={1} hidden={this.state.editedConditionIndex !== index}>
        <Button onClick={this.hideEditCondition} bsStyle="link">
          <i className="fa fa-fw fa-minus" />
        </Button>
      </Col>
      <Col sm={1}>
        <Button onClick={this.removeCondition(index)} bsStyle="link">
          <i className="fa fa-fw danger-red fa-trash-o" />
        </Button>
      </Col>
      <Col sm={12}>
        <Panel collapsible expanded={this.state.editedConditionIndex === index}>
          { this.renderConditionEditForm(condition, index) }
        </Panel>
      </Col>
    </FormGroup>
  );

  renderAddConditionButton = () => (
    <Button className="btn-primary" onClick={this.addCondition}><i className="fa fa-plus" />&nbsp;Add New Condition</Button>
  );

  renderConditions = () => (
    this.props.item.get('conditions', Immutable.List()).map(this.renderCondition).toArray()
  );

  renderConditionsHeader = () => (
    <FormGroup className="form-inner-edit-row">
      <Col sm={12}>
        <strong>Conditions</strong>
      </Col>
    </FormGroup>
  );

  render() {
    const { item } = this.props;
    return (
      <Form horizontal>
        <FormGroup>
          <Col componentClass={ControlLabel} md={4}>
            Event Code
          </Col>
          <Col sm={5}>
            <Field id="label" onChange={this.onChangeField(['event_code'])} value={item.get('event_code', '')} />
          </Col>
        </FormGroup>

        <FormGroup>
          <Col sm={12}>
            { this.renderConditionsHeader() }
          </Col>
          <Col sm={12}>
            { this.renderConditions() }
          </Col>
          <Col sm={12}>
            { this.renderAddConditionButton() }
          </Col>
        </FormGroup>
      </Form>
    );
  }
}

const mapStateToProps = (state, props) => ({
  propertyTypes: propertyTypeSelector(state, props),
  usageTypesData: usageTypesDataSelector(state, props),
  currency: currencySelector(state, props),
});

export default connect(mapStateToProps)(EventBalanceForm);
