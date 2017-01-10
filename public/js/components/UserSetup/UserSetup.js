import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Col, Panel, Button } from 'react-bootstrap';
import Immutable from 'immutable';
import LoadingItemPlaceholder from '../Elements/LoadingItemPlaceholder';
import User from './User';
/* ACTIONS */
import { getUser, saveUser, clearUser, updateUserField, deleteUserField } from '../../actions/userActions';
import { clearList } from '../../actions/listActions';
import { apiBillRunErrorHandler } from '../../common/Api';
import { showSuccess, showDanger } from '../../actions/alertsActions';
import { setPageTitle } from '../../actions/guiStateActions/pageActions';


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
    const { userId, action } = this.props.location.query;
    if (userId) {
      const userParams = {
        api: 'users',
        params: [
          { userId },
          { action: 'read' },
        ],
      };
      this.props.dispatch(getUser(userParams));
    }
    if (action === 'new') {
      this.props.dispatch(setPageTitle('Create New User'));
    } else {
      this.props.dispatch(setPageTitle('Edit user'));
    }
  }

  componentWillReceiveProps(nextProps) {
    const { user, location: { query: { action } } } = nextProps;
    const { user: oldUser } = this.props;
    if (action === 'update' && oldUser.get('username', '') !== user.get('username', '')) {
      this.props.dispatch(setPageTitle(`Edit user - ${user.get('username', '')}`));
    }
  }

  componentWillUnmount() {
    this.props.dispatch(clearUser());
    this.props.dispatch(clearList('users'));
  }

  onBack = () => {
    this.props.router.push('/users');
  }

  onSave = () => {
    if (this.validate()) {
      this.props.dispatch(saveUser()).then((response) => {
        if (response === true) {
          this.props.dispatch(showSuccess('User saved successfully'));
          this.onBack();
        } else {
          this.props.dispatch(apiBillRunErrorHandler(response));
        }
      });
    }
  }

  onUpdateValue = (path, value = '') => {
    this.props.dispatch(updateUserField(path, value));
  }

  onDeleteValue = (path) => {
    this.props.dispatch(deleteUserField(path));
  }

  validate = () => {
    const { user, location: { query: { action } } } = this.props;
    if (action === 'new') {
      if (user.get('username', '').length === 0) {
        this.props.dispatch(showDanger('User name field is required'));
        return false;
      }
      if (user.get('password', '').length === 0) {
        this.props.dispatch(showDanger('Password field is required'));
        return false;
      }

      if (user.get('roles').length === 0) {
        this.props.dispatch(showDanger('Roles field is required'));
        return false;
      }
      return true;
    }

    if (user.has('username') && user.get('username', '').length === 0) {
      this.props.dispatch(showDanger('User name field is required'));
      return false;
    }
    if (user.has('password') && user.get('password', '').length === 0) {
      this.props.dispatch(showDanger('Password field is required'));
      return false;
    }

    if (user.has('roles') && user.get('roles').length === 0) {
      this.props.dispatch(showDanger('Roles field is required'));
      return false;
    }
    return true;
  }

  render() {
    const { user, location: { query: { action } } } = this.props;
    // in update mode wait for item before render edit screen
    if (action === 'update' && typeof user.getIn(['_id', '$id']) === 'undefined') {
      return (<LoadingItemPlaceholder onClick={this.onBack} />);
    }
    return (
      <Col lg={12}>
        <Panel>
          <User
            action={action}
            user={user}
            onUpdateValue={this.onUpdateValue}
            onDeleteValue={this.onDeleteValue}
          />
        </Panel>
        <div style={{ marginTop: 12 }}>
          <Button onClick={this.onSave} bsStyle="primary" style={{ marginRight: 10 }}>Save</Button>
          <Button onClick={this.onBack} bsStyle="default">Cancel</Button>
        </div>
      </Col>
    );
  }

}


const mapStateToProps = state => ({
  user: state.entity.get('users', Immutable.Map()),
});

export default withRouter(connect(mapStateToProps)(UserSetup));
