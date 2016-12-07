
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Immutable from 'immutable';
import LoginForm from '../components/LoginForm';
import { Forbidden_403 } from '../components/Errors';

export default function (ComposedComponent) {
  class Authenticate extends Component {

    static defaultProps = {
      auth: null,
      roles: null,
      permissions: Immutable.Map(),
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
      openLoginPopup: PropTypes.func,
    };

    handleOpenLogin = () => {
      this.props.openLoginPopup();
    }

    render() {
      const { auth, roles, permissions } = this.props;
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
      const pageName = _.last(this.props.location.pathname.split('/'));
      const { action = 'view' } = this.props.location.query;
      const perms = permissions.getIn([pageName, action], Immutable.List());
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


  function createPermissionFromMenu(permissions, menu) {
    const route = menu.get('route', '');
    const viewRoles = Immutable.Map({
      view: menu.get('roles', Immutable.List()),
    });
    if (route.length) {
      return permissions.set(route, viewRoles);
    }
    return permissions;
  }
  function createPermissionFromMenuTree(permissions, tree) {
    let permissionsTree = permissions;
    tree.forEach((menuItem) => {
      permissionsTree = createPermissionFromMenu(permissionsTree, menuItem);
      if (menuItem.has('subMenus')) {
        permissionsTree = createPermissionFromMenuTree(permissionsTree, menuItem.get('subMenus', Immutable.List()));
      }
    });
    return permissionsTree;
  }

  const mapStateToProps = (state) => {
    let permissions = Immutable.Map();
    const menuTree = state.settings.getIn(['menu', 'main'], Immutable.List());
    permissions = createPermissionFromMenuTree(permissions, menuTree);

    return ({
      auth: state.user.get('auth'),
      roles: state.user.get('roles'),
      permissions,
    });
  };

  return connect(mapStateToProps)(Authenticate);
}
