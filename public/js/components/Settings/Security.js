import React, { PropTypes, Component } from 'react';
import moment from 'moment';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Panel, Col, Row, Button } from 'react-bootstrap';
import List from '../../components/List';
import { getItemDateValue, getConfig } from '../../common/Util';
import { StateIcon, ConfirmModal } from '../Elements';
import { addSharedSecret, getSettings, removeSharedSecret, updateSharedSecret } from '../../actions/settingsActions';
import SecurityForm from './Security/SecurityForm';
import { saveSharedSecretQuery, disableSharedSecretQuery } from '../../common/ApiQueries';
import { apiBillRun } from '../../common/Api';
import { showSuccess, showDanger } from '../../actions/alertsActions';


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
    const date = getItemDateValue(item, field.id, false);
    return date ? date.format(getConfig('dateFormat', 'DD/MM/YYYY')) : '';
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

  onSaveSecretParams = (secret, action) => {
    apiBillRun(saveSharedSecretQuery(secret)).then(
      (success) => { // eslint-disable-line no-unused-vars
        if (action === 'create') {
          this.props.dispatch(showSuccess('Secret was created successfully'));
          this.props.dispatch(addSharedSecret(secret));
        }
        if (action === 'edit') {
          this.props.dispatch(showSuccess('Secret was edited successfully'));
          this.props.dispatch(updateSharedSecret(secret));
        }
        return true;
      },
      (failure) => { // eslint-disable-line no-unused-vars
        this.props.dispatch(showDanger(failure.error[0].error.data.message));
        return false;
      }
    ).then(
      (status) => {
        if (status) {
          this.setState({ currentItem: null });
          this.props.dispatch(getSettings(['shared_secret']));
        }
      }
    ).catch(
      (error) => { // eslint-disable-line no-unused-vars
        this.props.dispatch(showDanger('Error saving secret - please try again'));
      }
    );
  };


  onClickRemoveOk = () => {
    const { itemToRemove } = this.state;
    const key = itemToRemove.get('key', '');
    apiBillRun(disableSharedSecretQuery(key)).then(
      (success) => { // eslint-disable-line no-unused-vars
        this.props.dispatch(showSuccess('Secret disabled!'));
        this.props.dispatch(removeSharedSecret(key));
        this.setState({ showConfirmRemove: false, itemToRemove: null });
      },
      (failure) => {
        this.props.dispatch(showDanger(failure.error[0].error.data.message));
        this.setState({ showConfirmRemove: false, itemToRemove: null });
      }
    ).catch(
      (error) => {
        this.props.dispatch(showDanger('Network error - please try again'));
      }
    );
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
        { currentItem !== null && <SecurityForm item={currentItem} show={true} onSave={this.onSaveSecretParams} onCancel={this.onCancel} /> }
      </div>
    );
  }
}

export default withRouter(connect()(Security));
