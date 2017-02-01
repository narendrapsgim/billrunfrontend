import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { Tabs, Tab, Panel } from 'react-bootstrap';
import { ucFirst } from 'change-case';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
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
        const SortableItem = SortableElement(props => (
          <div style={{ borderTop: '1px solid #eee', borderBottom: '1px solid #eee', paddingTop: 10 }}>
            <CustomField
              field={props.field}
              entity={props.entity}
              index={props.idx}
              disabled={!props.editable}
              onChange={this.onChangeField}
              onRemove={this.onRemoveField}
            />
          </div>
        ));
        fields.push(
          <SortableItem
            key={`item-${index}`}
            index={index}
            field={field}
            entity={entity}
            editable={editable}
            idx={index}
          />
        );
      }
    });
    const SortableList = SortableContainer(({ sortableFields }) =>
      (<Panel style={{ borderTop: 'none' }}>{sortableFields}</Panel>)
    );
    return (
      <Tab key={key} title={`${ucFirst(entity)} Fields`} eventKey={key}>
        <SortableList
          lockAxis="y"
          helperClass="draggable-menu"
          useDragHandle={true}
          sortableFields={fields}
          onSortEnd={this.onSortEnd}
        />
        <button type="button" className="btn btn-link" onClick={this.onAddNewField(entity)}> Add New Field </button>
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
