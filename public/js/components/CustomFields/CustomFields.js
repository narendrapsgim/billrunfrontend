import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { Form, Tabs, Tab, Panel, Col, FormGroup, ControlLabel, Row } from 'react-bootstrap';
import { ucFirst } from 'change-case';
import CustomField from './CustomField';
import { ActionButtons, CreateButton, SortableFieldsContainer } from '../Elements';
import {
  getSettings,
  updateSetting,
  removeSettingField,
  saveSettings,
  setFieldPosition,
} from '../../actions/settingsActions';
import {
  accountFieldsSelector,
  subscriberFieldsSelector,
  productFieldsSelector,
  seriveceFieldsSelector,
} from '../../selectors/settingsSelector';
import { getSettingsKey, getSettingsPath } from '../../common/Util';

class CustomFields extends Component {

  static propTypes = {
    subscriber: PropTypes.instanceOf(Immutable.List), // eslint-disable-line react/no-unused-prop-types
    customer: PropTypes.instanceOf(Immutable.List), // eslint-disable-line react/no-unused-prop-types
    product: PropTypes.instanceOf(Immutable.List), // eslint-disable-line react/no-unused-prop-types
    service: PropTypes.instanceOf(Immutable.List), // eslint-disable-line react/no-unused-prop-types
    defaultDisabledFields: PropTypes.instanceOf(Immutable.Map),
    defaultHiddenFields: PropTypes.instanceOf(Immutable.Map),
    tabs: PropTypes.arrayOf(PropTypes.string),
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    subscriber: Immutable.List(),
    customer: Immutable.List(),
    product: Immutable.List(),
    service: Immutable.List(),
    defaultDisabledFields: Immutable.Map({
      customer: Immutable.List(['first_name', 'last_name', 'firstname', 'lastname', 'address']),
      subscriber: Immutable.List(['firstname', 'lastname', 'plan', 'services']),
    }),
    defaultHiddenFields: Immutable.Map({
      customer: Immutable.List(['aid', 'payment_gateway']),
      subscriber: Immutable.List(['sid', 'aid', 'plan_activation']),
    }),
    tabs: ['customer', 'subscriber', 'product', 'service'],
  };

  state = {
    tab: 0,
    subscriber: Immutable.List(),
    customer: Immutable.List(),
    product: Immutable.List(),
    service: Immutable.List(),
  };

  componentDidMount() {
    this.fetchFields(this.afterReceiveSettings);
  }

  componentWillUnmount() {
    // reset unsaved fields changes
    this.fetchFields();
  }

  getSettingDistinctKeys = () => {
    const { tabs } = this.props;
    const settingKeys = tabs.map(getSettingsKey);
    return [...new Set(settingKeys)];
  }

  fetchFields = (callback) => {
    this.getSettingDistinctKeys().forEach((settingKey) => {
      if (!callback) {
        this.props.dispatch(getSettings(settingKey));
      } else {
        this.props.dispatch(getSettings(settingKey)).then(callback);
      }
    });
  }

  afterSave = (response) => {
    if (response && response.status === 1) {
      this.fetchFields(this.afterReceiveSettings);
    }
  }

  afterReceiveSettings = (response) => {
    const { customer, subscriber, product, service } = this.props;
    if (response) {
      this.setState({ customer, subscriber, product, service });
    }
  }

  onChangeField = (entity, index, id, value) => {
    this.props.dispatch(updateSetting(getSettingsKey(entity), getSettingsPath(entity, ['fields', index, id]), value));
  };

  onRemoveField = (entity, index) => {
    this.props.dispatch(removeSettingField(getSettingsKey(entity), getSettingsPath(entity, ['fields', index])));
  };

  onAddNewField = () => {
    const { tab } = this.state;
    const { tabs } = this.props;
    const entity = tabs[tab];
    const size = this.props[entity].size;
    const newField = Immutable.Map({
      editable: true,
      display: true,
    });
    this.props.dispatch(updateSetting(getSettingsKey(entity), getSettingsPath(entity, ['fields', size]), newField));
  };

  onClickCancel = () => {
    this.fetchFields();
  }

  onClickSave = () => {
    this.props.dispatch(saveSettings(this.getSettingDistinctKeys())).then(this.afterSave);
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { tab } = this.state;
    const { tabs } = this.props;
    const entity = tabs[tab];
    const key = getSettingsKey(entity);
    const path = getSettingsPath(entity, ['fields']);
    path.unshift(key);
    this.props.dispatch(setFieldPosition(oldIndex, newIndex, path));
  };

  onSelectTab = (tab) => {
    this.setState({ tab });
  };

  renderFieldsTab = (entity, key) => {
    const { defaultDisabledFields, defaultHiddenFields } = this.props;
    const existingEntityFields = this.state[entity];
    const entityFields = this.props[entity];
    const defaultEntityDisabledFields = defaultDisabledFields.get(entity, Immutable.List());
    const defaultEntityHiddenFields = defaultHiddenFields.get(entity, Immutable.List());
    const fields = [];
    entityFields.forEach((field, index) => {
      if (!field.get('generated', false) && !defaultEntityHiddenFields.includes(field.get('field_name', ''))) {
        const existing = existingEntityFields.findIndex(existingEntityField =>
          existingEntityField.get('field_name', '') === field.get('field_name', ''),
        ) !== -1;
        const editable = !field.get('system', false) && !defaultEntityDisabledFields.includes(field.get('field_name', ''));
        const fieldKey = existing ? `item-${entity}-${field.get('field_name', index)}-${index}` : `item-${entity}-${index}`;
        fields.push(
          <CustomField
            key={fieldKey}
            index={index}
            idx={index}
            field={field}
            entity={entity}
            editable={editable}
            existing={existing}
            onChange={this.onChangeField}
            onRemove={this.onRemoveField}
          />
        );
      }
    });

    return (
      <Tab key={key} title={ucFirst(entity)} eventKey={key}>
        <Panel style={{ borderTop: 'none' }}>
          <Row>
            <Col sm={12}>
              <FormGroup className="form-inner-edit-row">
                <Col sm={1}>&nbsp;</Col>
                <Col sm={3}><ControlLabel>Field Name</ControlLabel></Col>
                <Col sm={2}><ControlLabel>Title</ControlLabel></Col>
                <Col sm={2}><ControlLabel>Default Value</ControlLabel></Col>
              </FormGroup>
            </Col>
            <Col sm={12}>
              <SortableFieldsContainer
                lockAxis="y"
                helperClass="draggable-row"
                useDragHandle={true}
                items={fields}
                onSortEnd={this.onSortEnd}
              />
            </Col>
            <Col sm={12}>
              <CreateButton onClick={this.onAddNewField} type="Field" />
            </Col>
          </Row>
        </Panel>
      </Tab>
    );
  };

  render() {
    const { tabs } = this.props;
    return (
      <div className="CustomFields">
        <Form horizontal>
          <Tabs id="CustomFieldsTabs" animation={false} onSelect={this.onSelectTab}>
            { tabs.map(this.renderFieldsTab) }
          </Tabs>
          <ActionButtons onClickSave={this.onClickSave} onClickCancel={this.onClickCancel} cancelLabel="Reset changes" />
        </Form>
      </div>
    );
  }
}


const mapStateToProps = (state, props) => ({
  subscriber: subscriberFieldsSelector(state, props),
  customer: accountFieldsSelector(state, props),
  product: productFieldsSelector(state, props),
  service: seriveceFieldsSelector(state, props),
});
export default connect(mapStateToProps)(CustomFields);
