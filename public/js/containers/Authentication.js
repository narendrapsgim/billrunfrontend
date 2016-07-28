import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Immutable from 'immutable';

import RaisedButton from 'material-ui/RaisedButton';

import * as actions from '../actions'
import { permissions } from '../permissions';

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
      const { users } = this.props;
      if (!users || !users.get('roles') || !users.get('auth')) {
        return (<div  style={{textAlign:'center'}}>
          <h3 key="0">Please login.</h3>
          <br key="1"/>
          <RaisedButton key="2" label="Login" onClick={this.handleOpenLogin} />
        </div>);
      }
      if (users.get('roles').includes("admin")) {
        return (<ComposedComponent {...this.props} />);
      }
      const page_name = _.last(this.props.location.pathname.split('/'));
      const { action = 'view' } = this.props.location.query;
      const perms = permissions.getIn([page_name, action]);
      if (!perms) {
        return (<div style={{textAlign: 'center'}}><h3 style={{color:'red'}}>You don't have permission to access this page</h3></div>);
      }
      const permissionDenied = perms.toSet().intersect(users.get('roles')).size === 0;
      if (permissionDenied) {
        return (<div style={{textAlign: 'center'}}><h3>Authorization Error</h3></div>);
      }
      return <ComposedComponent {...this.props} />
    }
  }

  function mapStateToProps(state) {
    return { users: state.users };
  }

  return connect(mapStateToProps, actions)(Authenticate);
}
