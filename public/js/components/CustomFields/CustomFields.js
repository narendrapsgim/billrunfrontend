import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { Tabs, Tab, Panel } from 'react-bootstrap';
import { ucFirst } from 'change-case';
import CustomField from './CustomField';
import ActionButtons from '../Elements/ActionButtons';
import CreateButton from '../Elements/CreateButton';
import SortableFieldsContainer from './SortableFieldsContainer';
import { getSettings, updateSetting, removeSettingField, saveSettings, setFieldPosition } from '../../actions/settingsActions';
import { accountFieldsSelector, subscriberFieldsSelector, productFieldsSelector } from '../../selectors/settingsSelector';

class CustomFields extends Component {

  static propTypes = {
    subscriber: PropTypes.instanceOf(Immutable.List), // eslint-disable-line react/no-unused-prop-types
    account: PropTypes.instanceOf(Immutable.List), // eslint-disable-line react/no-unused-prop-types
    product: PropTypes.instanceOf(Immutable.List), // eslint-disable-line react/no-unused-prop-types
    keys: PropTypes.object,
    defaultDisabledFields: PropTypes.object,
    defaultHiddenFields: PropTypes.object,
    tabs: PropTypes.arrayOf(PropTypes.string),
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    subscriber: Immutable.List(),
    account: Immutable.List(),
    product: Immutable.List(),
    keys: {
      account: 'subscribers.account',
      subscriber: 'subscribers.subscriber',
      product: 'rates',
    },
    defaultDisabledFields: {
      account: ['first_name', 'last_name', 'firstname', 'lastname', 'address'],
      subscriber: ['firstname', 'lastname', 'plan', 'services'],
      product: [],
    },
    defaultHiddenFields: {
      account: ['aid', 'payment_gateway'],
      subscriber: ['sid', 'aid', 'plan_activation'],
      product: [],
    },
    tabs: ['account', 'subscriber', 'product'],
  };

  state = {
    tab: 0,
    subscriber: Immutable.List(),
    account: Immutable.List(),
    product: Immutable.List(),
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
    const settingKeys = tabs.map(this.getSettingsKey);
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
    if (response) {
      this.fetchFields(this.afterReceiveSettings);
    }
  }

  afterReceiveSettings = (response) => {
    const { account, subscriber, product } = this.props;
    if (response) {
      this.setState({ account, subscriber, product });
    }
  }

  getSettingsKey = (entity) => {
    const { keys } = this.props;
    return (typeof keys[entity] === 'undefined' ? entity : keys[entity].split('.')[0]);
  }

  getSettingsPath = (entity, path) => {
    const { keys } = this.props;
    if (typeof keys[entity] === 'undefined') {
      return path;
    }

    const keysArr = keys[entity].split('.');
    if (typeof keysArr[1] !== 'undefined') {
      path.unshift(keysArr[1]);
    }
    return path;
  }

  onChangeField = (entity, index, id, value) => {
    this.props.dispatch(updateSetting(this.getSettingsKey(entity), this.getSettingsPath(entity, ['fields', index, id]), value));
  };

  onRemoveField = (entity, index) => {
    this.props.dispatch(removeSettingField(this.getSettingsKey(entity), this.getSettingsPath(entity, ['fields', index])));
  };

  onAddNewField = () => {
    const { tab } = this.state;
    const { tabs } = this.props;
    const entity = tabs[tab];
    const size = this.props[entity].size;
    const newField = Immutable.Map();
    this.props.dispatch(updateSetting(this.getSettingsKey(entity), this.getSettingsPath(entity, ['fields', size]), newField));
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
    const key = this.getSettingsKey(entity);
    const path = this.getSettingsPath(entity, ['fields']);
    path.unshift(key);
    this.props.dispatch(setFieldPosition(oldIndex, newIndex, path));
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
      <Tab key={key} title={ucFirst(entity)} eventKey={key}>
        <Panel style={{ borderTop: 'none' }}>
          <SortableFieldsContainer
            lockAxis="y"
            helperClass="draggable-menu"
            useDragHandle={true}
            items={fields}
            onSortEnd={this.onSortEnd}
          />
          <CreateButton onClick={this.onAddNewField} type="Field" style={{ marginTop: 15 }} />
        </Panel>
      </Tab>
    );
  };

  render() {
    const { tabs } = this.props;
    return (
      <div className="CustomFields">
        <Tabs id="CustomFieldsTabs" animation={false} onSelect={this.onSelectTab}>
          { tabs.map(this.renderFieldsTab) }
        </Tabs>
        <ActionButtons onClickSave={this.onClickSave} onClickCancel={this.onClickCancel} cancelLabel="Reset changes" />
      </div>
    );
  }
}


const mapStateToProps = (state, props) => ({
  subscriber: subscriberFieldsSelector(state, props),
  account: accountFieldsSelector(state, props),
  product: productFieldsSelector(state, props),
});
export default connect(mapStateToProps)(CustomFields);
