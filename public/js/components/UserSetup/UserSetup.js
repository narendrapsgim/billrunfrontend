import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Col, Panel, Button } from 'react-bootstrap';
import Immutable from 'immutable';
import User from './User';
/* ACTIONS */
import { getEntity, updateEntityField, clearEntity } from '../../actions/entityActions';
import { clearList } from '../../actions/listActions';
import { apiBillRun, apiBillRunErrorHandler } from '../../common/Api';
import { showSuccess, showDanger } from '../../actions/alertsActions';

class UserSetup extends Component {

  static propTypes = {
    user: PropTypes.instanceOf(Immutable.Map),
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.shape({
      query: PropTypes.object.isRequired,
    }).isRequired,
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  }

  static defaultProps = {
    user: Immutable.Map(),
  };

  componentDidMount() {
    const { userId } = this.props.location.query;
    if (userId) {
      const userParams = {
        api: 'users',
        params: [
          { userId },
          { action: 'read' },
        ],
      };
      this.props.dispatch(getEntity('user', userParams));
    }
  }

  componentWillUnmount() {
    this.props.dispatch(clearEntity('user'));
    this.props.dispatch(clearList('users'));
  }

  onCancel = () => {
    this.props.router.push('/users');
  }

  onSaveUser = (password) => {
    const { user, location: { query: { action } } } = this.props;
    const params = action === 'update' ? [
        { action: 'update' },
        { userId: user.getIn(['_id', '$id'], '') },
        { username: user.get('username') },
        { roles: JSON.stringify(user.get('roles').toJS()) },
        { password },
    ] : [
        { action: 'insert' },
        { username: user.get('username') },
        { roles: JSON.stringify(user.get('roles', Immutable.List()).toJS()) },
        { password },
    ];

    const query = {
      api: 'users',
      params,
    };

    apiBillRun(query).then(
        (success) => { // eslint-disable-line no-unused-vars
          this.props.dispatch(showSuccess('User saved successfully'));
          this.onCancel();
        },
        (failure) => {
          this.props.dispatch(showDanger(`Error - ${failure.error[0].error.message}`));
        }
      ).catch(
        (error) => {
          this.props.dispatch(apiBillRunErrorHandler(error));
        }
      );
  }

  onUsernameChange = (e) => {
    const { value } = e.target;
    this.props.dispatch(updateEntityField('user', 'username', value));
  }

  onCheckboxClick = (roles = '') => {
    const userRoles = roles.length > 0 ? roles.split(',') : [];
    this.props.dispatch(updateEntityField('user', 'roles', userRoles));
  }


  render() {
    const { user, location: { query: { action } } } = this.props;

    return (
      <Col lg={12}>
        <Panel>
          <User
            action={action}
            user={user}
            onSaveUser={this.onSaveUser}
            onUsernameChange={this.onUsernameChange}
            onCheckboxClick={this.onCheckboxClick}
            onCancel={this.onCancel}
          />
        </Panel>
        <div style={{ marginTop: 12 }}>
          <Button onClick={this.onSaveUser} bsStyle="primary" style={{ marginRight: 10 }}>Save</Button>
          <Button onClick={this.onCancel} bsStyle="default">Cancel</Button>
        </div>
      </Col>
    );
  }

}


const mapStateToProps = state => ({
  user: state.entity.get('user', Immutable.Map()),
});

export default withRouter(connect(mapStateToProps)(UserSetup));
