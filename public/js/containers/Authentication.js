import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Immutable from 'immutable';

import LoginForm from '../components/LoginForm';
import { Forbidden_403 } from '../components/Errors';

import { permissions } from '../../permissions';

export default function (ComposedComponent) {
  class Authenticate extends Component {
    constructor(props) {
      super(props);
      this.handleOpenLogin = this.handleOpenLogin.bind(this);
    }

    handleOpenLogin(){
      this.props.openLoginPopup();
    }

    render() {
      const { user } = this.props;
      if (!user || !user.get('roles') || !user.get('auth')) {
        return (<LoginForm />);
      }
      if (user.get('roles').includes("admin")) {
        return (<ComposedComponent {...this.props} />);
      }
      const page_name = _.last(this.props.location.pathname.split('/'));
      const { action = 'view' } = this.props.location.query;
      const perms = permissions.getIn([page_name, action]);
      if (!perms) {
        return (<Forbidden_403 />);
      }
      const permissionDenied = perms.toSet().intersect(user.get('roles')).size === 0;
      if (permissionDenied) {
        return (<Forbidden_403 />);
      }
      return <ComposedComponent {...this.props} />
    }
  }

  function mapStateToProps(state) {
    return { user: state.user };
  }

  return connect(mapStateToProps)(Authenticate);
}
