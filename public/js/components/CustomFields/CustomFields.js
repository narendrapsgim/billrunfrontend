import React, { Component } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { ucFirst } from 'change-case';
import { Tabs, Tab, Panel } from 'react-bootstrap';
import { getSettings, updateSetting, removeSettingField, saveSettings, setFieldPosition } from '../../actions/settingsActions';
import CustomField from './CustomField';

class CustomFields extends Component {
  static defaultProps = {
    subscriber: Immutable.List(),
    account: Immutable.List()
  };

  static propTypes = {
    subscriber: React.PropTypes.instanceOf(Immutable.List),
    account: React.PropTypes.instanceOf(Immutable.List)
  };

  constructor(props) {
    super(props);

    this.state = {
      over: -1,
      tabs: ["account", "subscriber"],
      tab: 0
    };
  }

  componentDidMount() {
    this.props.dispatch(getSettings("subscribers"));
  }

  onChangeField = (entity, index, id, value) => {
    this.props.dispatch(updateSetting('subscribers', [entity, 'fields', index, id], value));
  };

  onRemoveField = (entity, index) => {
    this.props.dispatch(removeSettingField('subscribers', [entity, 'fields', index]));
  };

  onAddNewField = (entity) => {
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
    this.setState({over});
  };

  dragEnd = (index) => {
    const { over, tab, tabs } = this.state;
    const setting = tabs[tab];
    this.props.dispatch(setFieldPosition(index, over, ['subscribers', setting, 'fields']));
    this.setState({'over': -1});
  };

  onSelectTab = (key) => {
    this.setState({tab: this.state.tabs[key]});
  };

  renderFieldsTab = (entity, key) => {
    const onAddNew = () => {
      this.onAddNewField(entity);
    };

    return (
      <Tab
          key={ key }
          title={`${ucFirst(entity)} Fields`}
          eventKey={key}>
        <Panel style={{borderTop: 'none'}}>
          {
            this.props[entity]
                .map((field, field_key) => {
                  return !field.get('generated', false) &&
                         (<CustomField
                              key={ field_key }
                              field={ field }
                              entity={ entity }
                              index={ field_key }
                              dragStart={ this.dragStart }
                              dragOver={ this.dragOver }
                              dragEnd={ this.dragEnd }
                              over={ this.state.over === field_key }
                              onChange={ this.onChangeField }
                              onRemove={ this.onRemoveField }
                              last={ field_key === (this.props[entity].size - 1) }
                          />)
                })
          }
          <button type="button" className="btn btn-link" onClick={ onAddNew }>
            Add New Field
          </button>
        </Panel>
      </Tab>
    );
  };

  render() {
    const { account, subscriber } = this.props;

    return (
      <div className="CustomFields">
        <Tabs
            id="CustomFieldsTabs"
            animation={ false }
            onSelect={ this.onSelectTab }>
          {
            this.state.tabs.map((entity, ent_key) =>
              this.renderFieldsTab(entity, ent_key))
          }
        </Tabs>
        <div style={{marginTop: 12}}>
          <button
              type="submit"
              className="btn btn-primary"
              onClick={ this.onClickSave }
              style={{ marginRight: 10 }}
          >
            Save
          </button>
          <button
              type="reset"
              className="btn btn-default"
              onClick={ this.onClickCancel }
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    subscriber: state.settings.getIn(['subscribers', 'subscriber', 'fields']),
    account: state.settings.getIn(['subscribers', 'account', 'fields'])
  };
}

export default connect(mapStateToProps)(CustomFields);
