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
      subscriber: ['firstname', 'lastname'],
    },
    defaultHiddenFields: {
      account: ['aid', 'payment_gateway'],
      subscriber: ['sid', 'aid', 'plan_activation', 'services'],
    },
    tabs: ['account', 'subscriber'],
  };

  state = {
    tab: 0,
  };

  componentDidMount() {
    this.props.dispatch(getSettings('subscribers'));
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
    this.props.dispatch(saveSettings('subscribers'));
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
    const defaultDisabledFields = this.props.defaultDisabledFields[entity];
    const defaultHiddenFields = this.props.defaultHiddenFields[entity];
    const entityFields = this.props[entity];
    const fields = [];
    entityFields.forEach((field, index) => {
      if (!field.get('generated', false) && !defaultHiddenFields.includes(field.get('field_name', ''))) {
        const editable = !field.get('system', false) && !defaultDisabledFields.includes(field.get('field_name', ''));
        fields.push(
          <CustomField
            key={`item-${index}`}
            index={index}
            idx={index}
            field={field}
            entity={entity}
            editable={editable}
            onChange={this.onChangeField}
            onRemove={this.onRemoveField}
          />
        );
      }
    });

    return (
      <Tab key={key} title={`${ucFirst(entity)} Fields`} eventKey={key}>
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


const mapStateToProps = state => ({
  subscriber: state.settings.getIn(['subscribers', 'subscriber', 'fields']),
  account: state.settings.getIn(['subscribers', 'account', 'fields']),
});
export default connect(mapStateToProps)(CustomFields);
