import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { Tabs, Tab, Panel } from 'react-bootstrap';
import { ucFirst } from 'change-case';
import CustomField from './CustomField';
import { getSettings, updateSetting, removeSettingField, saveSettings, setFieldPosition } from '../../actions/settingsActions';

class CustomFields extends Component {

  static propTypes = {
    subscriber: PropTypes.instanceOf(Immutable.List),
    account: PropTypes.instanceOf(Immutable.List),
    defaultDisabledFields: PropTypes.object,
    defaultHiddenFields: PropTypes.object,
    tabs: PropTypes.arrayOf(PropTypes.string),
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    subscriber: Immutable.List(),
    account: Immutable.List(),
    defaultDisabledFields: {
      account: ['first_name', 'last_name'],
      subscriber: ['firstname', 'lastname'],
    },
    defaultHiddenFields: {
      account: ['aid'],
      subscriber: ['sid', 'aid'],
    },
    tabs: ['account', 'subscriber'],
  };

  state = {
    over: -1,
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

  onAddNewField = entity => () => {
    const size = this.props[entity].size;
    const newField = Immutable.Map();
    this.props.dispatch(updateSetting('subscribers', [entity, 'fields', size], newField));
  };

  onClickSave = () => {
    this.props.dispatch(saveSettings('subscribers'));
  };

  dragStart = (e) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget);
  };

  dragOver = (over) => {
    this.setState({ over });
  };

  dragEnd = (index) => {
    const { over, tab } = this.state;
    const { tabs } = this.props;
    const setting = tabs[tab];
    this.props.dispatch(setFieldPosition(index, over, ['subscribers', setting, 'fields']));
    this.setState({ over: -1 });
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
            key={index}
            field={field}
            entity={entity}
            index={index}
            disabled={!editable}
            onChange={this.onChangeField}
            onRemove={this.onRemoveField}
            dragStart={this.dragStart}
            dragOver={this.dragOver}
            dragEnd={this.dragEnd}
            over={this.state.over === index}
            last={index === (this.props[entity].size - 1)}
          />
      );
      }
    });
    return (
      <Tab key={key} title={`${ucFirst(entity)} Fields`} eventKey={key}>
        <Panel style={{ borderTop: 'none' }}>
          { fields }
          <button type="button" className="btn btn-link" onClick={this.onAddNewField(entity)}> Add New Field </button>
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
        <div style={{ marginTop: 12 }}>
          <button type="submit" className="btn btn-primary" onClick={this.onClickSave} style={{ marginRight: 10 }} > Save </button>
          <button type="reset" className="btn btn-default" onClick={this.onClickCancel} > Cancel </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  subscriber: state.settings.getIn(['subscribers', 'subscriber', 'fields']),
  account: state.settings.getIn(['subscribers', 'account', 'fields']),
});
export default connect(mapStateToProps)(CustomFields);
