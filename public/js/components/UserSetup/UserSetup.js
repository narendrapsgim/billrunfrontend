import React, { Component } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import User from './User';

/* ACTIONS */
import { getEntity, updateEntityField, gotEntity, clearEntity } from '../../actions/entityActions';
import { getList, clearList } from '../../actions/listActions';
import { getSettings } from '../../actions/settingsActions';
import { apiBillRun, apiBillRunErrorHandler } from '../../common/Api';
import { showSuccess, showDanger } from '../../actions/alertsActions';

/* COMPONENTS */
import { PageHeader, Tabs, Tab } from 'react-bootstrap';


class UserSetup extends Component {
	
	constructor(props){
		super(props);
	}

	componentDidMount() {
	   const { userId, action } = this.props.location.query;
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

      	this.props.dispatch(getEntity('user', userParams));
	}

	componentWillUnmount() {
    	this.props.dispatch(clearEntity());
    	this.props.dispatch(clearList('users'));
  	}

	onSaveUser = (password) => {
		const { dispatch, user } = this.props;
		const { action } = this.props.location.query;
    	const params = action === 'update'? [
    		{'action': 'update'},
    		{'userId': user.getIn(['_id', '$id'], '')},
    		{'username': user.get('username')},
    		{'roles': JSON.stringify(user.get('roles').toJS())},
    		{'password': password}
    	]: [
    		{'action': 'insert'},
    		{'username': user.get('username')},
    		{'roles': JSON.stringify(user.get('roles').toJS())},
    		{'password': password}
    	];


	    const query = {
	      api: "users",
	      params
	    };

	    apiBillRun(query).then(
	      success => {
	          dispatch(showSuccess("User saved successfully"));
	          this.context.router.push({
	            pathname: '/users'
	          });
	      },
	      failure => {
	        dispatch(showDanger(`Error - ${failure.error[0].error.desc}`));
	      }
	    ).catch(
	      error => {
			dispatch(showDanger("Network error - please try again"));
			dispatch(apiBillRunErrorHandler(error));
	      }
	    );
	}

	onUsernameChange = (e) => {
		const { value } = e.target;
		this.props.dispatch(updateEntityField('user', 'username', value));
	}

	onCheckboxClick = (e) => {
		const { user } = this.props;
		const { value } = e.target;
		const userRoles = user.update('roles', Immutable.List(), rolesList => {
			if(rolesList.includes(value)){
				return rolesList.filterNot(role => role === value);
			}
			return rolesList.push(e.target.value);
		});
		this.props.dispatch(updateEntityField('user', 'roles', userRoles.get('roles')));
	}

	render(){
		const { user } = this.props;
		const { action } = this.props.location.query;
		return(
			<div className="panel panel-default">
				<div className="panel-heading">
					<span>
	                  Edit user
	                </span>
				</div>
    			<div className="panel-body">
    			<div className="col-lg-6">
    				<User  onSaveUser={this.onSaveUser} action={action}
    					onUsernameChange={this.onUsernameChange} user={user}
    					onCheckboxClick={this.onCheckboxClick}
    				/>
            	</div>
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
    user: state.entity.get('user', Immutable.Map())
  };
}

export default connect(mapStateToProps)(UserSetup);