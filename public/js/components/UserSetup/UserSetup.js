import React, { Component } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import _ from 'lodash';

/* ACTIONS */
import { getEntity, updateEntityField, gotEntity, clearEntity } from '../../actions/entityActions';
import { getList, clearList } from '../../actions/listActions';
import { getSettings } from '../../actions/settingsActions';
import { apiBillRun, apiBillRunErrorHandler } from '../../common/Api';
import { showSuccess, showDanger } from '../../actions/alertsActions';

/* COMPONENTS */
import { PageHeader, Tabs, Tab } from 'react-bootstrap';
// import Customer from './Customer';
// import SubscriptionsList from './SubscriptionsList';
// import Subscription from './Subscription';

class UserSetup extends Component {
	
	constructor(props){
		super(props);
	}

	componentDidMount() {
	   // getEntity
	   const { userId } = this.props.location.query;
	   if(!userId){
	   		return;
	   }

	   const userParams = {
        api: "users",
        params: [
          { userId },
          { action: 'read' } 
        ]
      };

      	this.props.dispatch(getEntity('users', userParams));
	}

	render(){
		const { users } = this.props;
		const fields = [(
			<div className="form-group" key={1}>
                <label>Username</label>
		        <input className="form-control"
        	        id="username"
               	    value={ users.get("username") }
                />
            </div>),
			(<div className="form-group" key={2}>
				<label>Roles</label>
				{ ['admin','read','write'].map((role, key) => (
					<div className="checkbox">
					<label>
					<input type="checkbox"
						value={role}
						checked={users.get('roles', []).includes(role)}
					/>{role}
					</label>
					</div>
				)) }
			</div>)];
		return(
			<div className="panel panel-default">
				<div className="panel-heading">
					<span>
	                  Edit user
	                </span>
				</div>
    			<div className="panel-body">
    			<form>
              		{ fields }
            	</form>
    			</div>
			</div>
		)
	};

}

UserSetup.contextTypes = {
  router: React.PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
  	//user: state.list.get('users') || []
    users: state.entity.get('users') || Immutable.Map()
    // subscriptions: state.list.get('subscriptions') || Immutable.List(),
    // settings: state.settings.get('subscribers') || Immutable.List(),
    // plans: state.list.get('plans') || Immutable.List()
  };
}

export default connect(mapStateToProps)(UserSetup);