import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { permissions } from '../permissions';

export default function (ComposedComponent) {
  class Authenticate extends Component {    
    render() {
      const { users } = this.props;
      if (!users.roles || users.roles.length === 0)
        return (<div>Unauthorized</div>);
      return <ComposedComponent {...this.props} />
    }
  }

  Authenticate.contextTypes = {
    router: React.PropTypes.object
  };

  function mapStateToProps(state) {
    return { users: state.users };
  }

  return connect(mapStateToProps)(Authenticate);
}
