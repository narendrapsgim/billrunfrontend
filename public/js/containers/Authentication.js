import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import LoginForm from '../components/LoginForm';
import { Forbidden_403 } from '../components/Errors';
import { permissionsSelector } from '../selectors/guiSelectors';
import { actionSelector } from '../selectors/entitySelector';


export default function (ComposedComponent) {
  class Authenticate extends Component {

    static defaultProps = {
      auth: null,
      roles: null,
      permissions: Immutable.Map(),
      action: 'view',
      openLoginPopup: () => {},
    };

    static propTypes = {
      auth: React.PropTypes.oneOfType([
        PropTypes.bool,
        null,
      ]),
      roles: React.PropTypes.oneOfType([
        PropTypes.array,
        null,
      ]),
      permissions: PropTypes.instanceOf(Immutable.Map),
      action: PropTypes.string,
      openLoginPopup: PropTypes.func,
    };

    handleOpenLogin = () => {
      this.props.openLoginPopup();
    }

    render() {
      const { auth, roles, permissions, action } = this.props;
      // If user is not authorized -> return login
      if (!roles || !auth) {
        return (<LoginForm />);
      }
      // Waiting for permission load
      if (permissions.size === 0) {
        return null;
      }
      // If user admin -> return true
      if (roles.includes('admin')) {
        return (<ComposedComponent {...this.props} />);
      }
      const pageRoute = this.props.location.pathname.substr(1);
      const perms = permissions.getIn([pageRoute, action], Immutable.List());
      // If no permissions required -> return true
      if (perms.size === 0) {
        return (<ComposedComponent {...this.props} />);
      }
      // Check if user has permissions
      const permissionDenied = perms.toSet().intersect(roles).size === 0;
      if (permissionDenied) {
        return (<Forbidden_403 />);
      }
      return (<ComposedComponent {...this.props} />);
    }
  }

  const mapStateToProps = (state, props) => ({
    auth: state.user.get('auth'),
    roles: state.user.get('roles'),
    permissions: permissionsSelector(state),
    action: actionSelector(state, props),
  });

  return connect(mapStateToProps)(Authenticate);
}
