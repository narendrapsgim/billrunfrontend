import React, { Component } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { ucFirst } from 'change-case';

import { getSettings, updateSetting, removeSettingField } from '../../actions/settingsActions';

import { Panel, Row, Col, ControlLabel, FormGroup } from 'react-bootstrap';
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
    console.log("saving ", this.props.account, this.props.subscriber);
  };
  
  fieldsPanelRender = (entity, key) => {
    const onAddNew = () => {
      this.onAddNewField(entity);
    };
    return (
      <Panel header={ <h3>{ ucFirst(entity) } Fields</h3> } key={ key }>
        {
          this.props[entity]
              .map((field, field_key) => {
                return !field.get('generated', false) &&
                       (<CustomField
                            key={ field_key }
                            field={ field }
                            entity={ entity }
                            index={ field_key }
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
    );
  };
  
  render() {
    const { account, subscriber } = this.props;

    return (
      <div className="CustomFields">
      {
        ["account", "subscriber"].map((entity, ent_key) =>
          this.fieldsPanelRender(entity, ent_key))
      }
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
