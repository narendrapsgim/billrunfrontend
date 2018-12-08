import React, { PropTypes, Component } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { Form, FormGroup, Col, ControlLabel, Button, Panel } from 'react-bootstrap';
import { getConditionDescription } from './../EventsUtil';
import Field from '../../Field';
import { Actions } from '../../Elements';
import BalanceEventCondition from './BalanceEventCondition';
import { usageTypesDataSelector, propertyTypeSelector, currencySelector } from '../../../selectors/settingsSelector';

class BalanceEvent extends Component {

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

  onChangeActive = (e) => {
    const { value } = e.target;
    this.props.updateField(['active'], value === 'yes');
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
          <BalanceEventCondition
            item={condition}
            index={index}
            onChangeField={this.props.updateField}
            propertyTypes={propertyTypes}
            usageTypesData={usageTypesData}
          />
        );
    }
  }

  showConditionDetails = (index) => {
    const { editedConditionIndex } = this.state;
    return editedConditionIndex === index;
  }

  getConditionActions = index => [
    { type: 'edit', onClick: this.editCondition(index), show: !this.showConditionDetails(index) },
    { type: 'collapse', onClick: this.hideEditCondition, show: this.showConditionDetails(index) },
    { type: 'remove', onClick: this.removeCondition(index) },
  ];

  renderCondition = (condition, index) => {
    const { conditionType, propertyTypes, usageTypesData, currency } = this.props;
    const activityType = 'counter';
    const params = ({ propertyTypes, usageTypesData, currency, activityType });
    return (
      <FormGroup key={index} className="mb0">
        <Col sm={12}>
          <div style={{ paddingRight: 100, display: 'inline-block' }}>
            { getConditionDescription(conditionType, condition, params) }
          </div>
          <span style={{ marginLeft: -100, paddingRight: 15 }} className="pull-right List row">
            <Actions actions={this.getConditionActions(index)} />
          </span>
        </Col>
        <Col sm={12}>
          <Panel collapsible expanded={this.state.editedConditionIndex === index}>
            { this.renderConditionEditForm(condition, index) }
          </Panel>
        </Col>
      </FormGroup>
    );
  }

  renderAddConditionButton = () => (
    <Button className="btn-primary" onClick={this.addCondition}><i className="fa fa-plus" />&nbsp;Add New Condition</Button>
  );

  renderConditions = () => (
    this.props.item.get('conditions', Immutable.List()).map(this.renderCondition).toArray()
  );

  render() {
    const { item } = this.props;
    return (
      <Form horizontal>
        <Panel header={<span>Details</span>}>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={3}>
              Event Code
            </Col>
            <Col sm={7}>
              <Field id="label" onChange={this.onChangeField(['event_code'])} value={item.get('event_code', '')} />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={3}>
              Description
            </Col>
            <Col sm={7}>
              <Field id="description" onChange={this.onChangeField(['event_description'])} value={item.get('event_description', '')} />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={3}>Status</Col>
            <Col sm={7}>
              <span>
                <span style={{ display: 'inline-block', marginRight: 20 }}>
                  <Field
                    fieldType="radio"
                    onChange={this.onChangeActive}
                    name="step-active-status"
                    value="yes"
                    label="Active"
                    checked={item.get('active', true)}
                  />
                </span>
                <span style={{ display: 'inline-block' }}>
                  <Field
                    fieldType="radio"
                    onChange={this.onChangeActive}
                    name="step-active-status"
                    value="no"
                    label="Not Active"
                    checked={!item.get('active', true)}
                  />
                </span>
              </span>
            </Col>
          </FormGroup>
        </Panel>

        <Panel header={<span>Conditions</span>}>
          <FormGroup>
            <Col sm={12}>
              { this.renderConditions() }
            </Col>
            <Col sm={12}>
              { this.renderAddConditionButton() }
            </Col>
          </FormGroup>
        </Panel>
      </Form>
    );
  }
}

const mapStateToProps = (state, props) => ({
  propertyTypes: propertyTypeSelector(state, props),
  usageTypesData: usageTypesDataSelector(state, props),
  currency: currencySelector(state, props),
});

export default connect(mapStateToProps)(BalanceEvent);
