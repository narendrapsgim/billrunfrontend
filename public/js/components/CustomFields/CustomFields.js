import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { Form, Tabs, Tab, Panel, Col, FormGroup, ControlLabel, Row } from 'react-bootstrap';
import { ucFirst } from 'change-case';
import CustomField from './CustomField';
import { ActionButtons, CreateButton, SortableFieldsContainer } from '../Elements';
import { getSettings, updateSetting, removeSettingField, saveSettings, setFieldPosition } from '../../actions/settingsActions';
import { accountFieldsSelector, subscriberFieldsSelector } from '../../selectors/settingsSelector';

class CustomFields extends Component {

  static propTypes = {
    subscriber: PropTypes.instanceOf(Immutable.List), // eslint-disable-line react/no-unused-prop-types
    account: PropTypes.instanceOf(Immutable.List), // eslint-disable-line react/no-unused-prop-types
    defaultDisabledFields: PropTypes.object,
    defaultHiddenFields: PropTypes.object,
    tabs: PropTypes.arrayOf(PropTypes.string),
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    subscriber: Immutable.List(),
    account: Immutable.List(),
    defaultDisabledFields: {
      account: ['first_name', 'last_name', 'firstname', 'lastname', 'address'],
      subscriber: ['firstname', 'lastname', 'plan', 'services'],
    },
    defaultHiddenFields: {
      account: ['aid', 'payment_gateway'],
      subscriber: ['sid', 'aid', 'plan_activation'],
    },
    tabs: ['account', 'subscriber'],
  };

  state = {
    tab: 0,
    subscriber: Immutable.List(),
    account: Immutable.List(),
  };

  componentDidMount() {
    this.fetchFields();
  }

  componentWillUnmount() {
    // reset unsaved fields changes
    this.props.dispatch(getSettings('subscribers'));
  }

  fetchFields = () => {
    this.props.dispatch(getSettings('subscribers')).then(this.afterReceiveSettings);
  }

  afterSave = (response) => {
    if (response) {
      this.fetchFields();
    }
  }

  afterReceiveSettings = (response) => {
    const { account, subscriber } = this.props;
    if (response) {
      this.setState({ account, subscriber });
    }
  }

  onChangeField = (entity, index, id, value) => {
    this.props.dispatch(updateSetting('subscribers', [entity, 'fields', index, id], value));
  };

  onRemoveField = (entity, index) => {
    this.props.dispatch(removeSettingField('subscribers', [entity, 'fields', index]));
  };

  onAddNewField = () => {
    const { tab } = this.state;
    const { tabs } = this.props;
    const entity = tabs[tab];
    const size = this.props[entity].size;
    const newField = Immutable.Map();
    this.props.dispatch(updateSetting('subscribers', [entity, 'fields', size], newField));
  };

  onClickCancel = () => {
    this.props.dispatch(getSettings('subscribers'));
  }

  onClickSave = () => {
    this.props.dispatch(saveSettings('subscribers')).then(this.afterSave);
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { tab } = this.state;
    const { tabs } = this.props;
    const entity = tabs[tab];
    this.props.dispatch(setFieldPosition(oldIndex, newIndex, ['subscribers', entity, 'fields']));
  };

  onSelectTab = (tab) => {
    this.setState({ tab });
  };

  renderFieldsTab = (entity, key) => {
    const existingEntityFields = this.state[entity];
    const entityFields = this.props[entity];
    const defaultDisabledFields = this.props.defaultDisabledFields[entity];
    const defaultHiddenFields = this.props.defaultHiddenFields[entity];
    const fields = [];
    entityFields.forEach((field, index) => {
      if (!field.get('generated', false) && !defaultHiddenFields.includes(field.get('field_name', ''))) {
        const existing = existingEntityFields.findIndex(existingEntityField =>
          existingEntityField.get('field_name', '') === field.get('field_name', '')
        ) !== -1;
        const editable = !field.get('system', false) && !defaultDisabledFields.includes(field.get('field_name', ''));
        const fieldKey = existing ? `item-${entity}-${field.get('field_name', index)}` : `item-${entity}-${index}`
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
      <Tab key={key} title={`${ucFirst(entity)} Fields`} eventKey={key}>
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
  account: accountFieldsSelector(state, props),
});
export default connect(mapStateToProps)(CustomFields);
