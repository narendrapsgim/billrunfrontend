import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Immutable from 'immutable';

import { permissions } from '../permissions';

export default function (ComposedComponent) {
  class Authenticate extends Component {    
    render() {
      const { users } = this.props;
      if (!users.get('auth')) return (<div>Unauthorized</div>);
      const page_name = _.last(this.props.location.pathname.split('/'));
      const { action = 'view' } = this.props.location.query;
      const perms = permissions.getIn([page_name, action]);
      const permissionDenied = perms.toSet().intersect(users.get('roles')).size === 0;
      if (permissionDenied) return (<div>Unauthorized</div>);
      return <ComposedComponent {...this.props} />
    }
  }

  function mapStateToProps(state) {
    return { users: state.users };
  }

  return connect(mapStateToProps)(Authenticate);
}
