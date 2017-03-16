import React, { PropTypes, Component } from 'react';
import moment from 'moment';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Panel, Col, Row, Button } from 'react-bootstrap';
import List from '../../components/List';
import { getItemDateValue } from '../../common/Util';
import { StateIcon, ConfirmModal } from '../Elements';
import { updateSetting, saveSettings, removeSettingField, pushToSetting } from '../../actions/settingsActions';
import SecurityForm from './Security/SecurityForm';

class Security extends Component {

  static propTypes = {
    data: PropTypes.instanceOf(Immutable.List),
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    data: Immutable.List(),
  };
  state = {
    showConfirmRemove: false,
    itemToRemove: null,
    currentItem: null,
  }

  parseDate = (item, field) => {
    const fieldValue = item.get(field.id, false);
    if (fieldValue) {
      return moment(fieldValue).format(globalSetting.dateFormat);
    }
    return '';
  }

  parserState = item => (
    <StateIcon
      from={getItemDateValue(item, 'from', moment(0)).toISOString()}
      to={getItemDateValue(item, 'to', moment(0)).toISOString()}
    />
  );

  onClickEdit = (item) => {
    this.setState({ currentItem: item });
  };

  onClickRemove = (item) => {
    this.setState({
      showConfirmRemove: true,
      itemToRemove: item,
    });
  }

  onClickRemoveClose = () => {
    this.setState({
      showConfirmRemove: false,
      itemToRemove: null,
    });
  }

  onCancel = () => {
    this.setState({ currentItem: null });
  }

  onSave = (item) => {
    const { data } = this.props;
    const key = item.get('key');
    if (typeof key === 'undefined') {
      this.props.dispatch(pushToSetting('shared_secret', item));
    } else {
      const idx = data.findIndex(dataItem => dataItem.get('key') === key);
      this.props.dispatch(updateSetting('shared_secret', [idx], item));
    }
    this.props.dispatch(saveSettings('shared_secret'));
    this.setState({ currentItem: null });
  }

  onClickRemoveOk = () => {
    const { itemToRemove } = this.state;
    const { data } = this.props;
    const key = itemToRemove.get('key', '');
    const idx = data.findIndex(dataItem => dataItem.get('key') === key);
    this.props.dispatch(removeSettingField('shared_secret', [idx]));
    this.props.dispatch(saveSettings('shared_secret'));
    this.setState({ showConfirmRemove: false, itemToRemove: null });
  }

  onClickNew = () => {
    this.setState({ currentItem: Immutable.Map() });
  }

  renderPanelHeader = () => {
    return (
      <div>
        List of all available keys
        <div className="pull-right">
          <Button bsSize="xsmall" className="btn-primary" onClick={this.onClickNew}>
            <i className="fa fa-plus" />&nbsp;Add New
          </Button>
        </div>
      </div>
    );
  }

  renderList = () => {
    const { data } = this.props;
    const fields = this.getListFields();
    const actions = this.getListActions();
    return (
      <List items={data} fields={fields} edit={false} actions={actions} />
    );
  }

  getListFields = () => [
    { id: 'state', title: 'Status', parser: this.parserState, cssClass: 'state' },
    { id: 'name', title: 'Name' },
    { id: 'key', title: 'Secret Key' },
    { id: 'from', title: 'Creation Date', parser: this.parseDate, cssClass: 'short-date' },
    { id: 'to', title: 'Expiration Date', parser: this.parseDate, cssClass: 'short-date' },
  ]

  getListActions = () => [
    { type: 'edit', showIcon: true, helpText: 'Edit', onClick: this.onClickEdit },
    { type: 'remove', showIcon: true, helpText: 'Remove', onClick: this.onClickRemove },
  ]

  render() {
    const { showConfirmRemove, currentItem } = this.state;
    const removeConfirmMessage = 'Are you sure you want to remove this key ?';

    return (
      <div>
        <ConfirmModal onOk={this.onClickRemoveOk} onCancel={this.onClickRemoveClose} show={showConfirmRemove} message={removeConfirmMessage} labelOk="Yes" />
        <Row>
          <Col lg={12}>
            <Panel header={this.renderPanelHeader()}>
              { this.renderList() }
            </Panel>
          </Col>
        </Row>
        { currentItem !== null && <SecurityForm item={currentItem} show={true} onSave={this.onSave} onCancel={this.onCancel} /> }
      </div>
    );
  }
}

export default withRouter(connect()(Security));
