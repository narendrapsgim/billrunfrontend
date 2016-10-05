import React, { Component } from 'react';
import { Link } from 'react-router';

export default class User extends Component{
	constructor(props){
		super(props);
		this.state = {  'isPassChange': false, 
						'password': '',
						'password1': '',
						'disableSave': false,
						'showPassMessage': false
					 };
	}
	
	componentWillMount() {
	 	const { action } = this.props;
	 	if(action == 'new'){
	 		this.setState({ disableSave: true, isPassChange: true }); 
	 	}	    
	}

	validatePass = (e) => {
		this.setState({ [e.target.id]: e.target.value }, () => {
			const { password, password1 } = this.state;
			if(!password.trim()){
				return this.setState({ showPassMessage: 'Please fill in password input', disableSave: true });
			}

			if(!password1.trim()){
				return this.setState({ disableSave: true });
			}

			if(password.trim() !== password1.trim()){
				return this.setState({ showPassMessage: 'Passwords do not match', disableSave: true });
			}

			return this.setState({ showPassMessage: false, disableSave: false });
		});
	};

	onSaveUser = () => {
		const { onSaveUser } = this.props;
		onSaveUser(this.state.password);
	}

	onCancel = () => {
		const { onCancel } = this.props;
		onCancel();
	}

	render(){
		const { onSaveUser,  onUsernameChange, onCheckboxClick, user, action } = this.props;
		return (
			<form>
			<div className="form-group" key={1}>
                <label>Username</label>
		        <input className="form-control"
        	        id="username"
               	    value={ user.get("username", "") }
               	    onChange={onUsernameChange}
                />
            </div>
            { action !== 'new'?
				<div className="form-group" key={2}>
					<div className="checkbox">
					<label>
					<input type="checkbox"
						value="change password"
						checked={ this.state.isPassChange }
						onChange={ () => { this.setState({ isPassChange: !this.state.isPassChange, password: '', password1: ''})
										if( !this.state.disableSave ){
											this.setState({disableSave: !this.state.disableSave})
										}
					 			 }}
					/>Enable Password Change
					</label>
					</div>
				</div>
				: null
			}	
			<div className="form-group" key={3}>
				<label>Password</label>
		        <input className="form-control"
        	        id="password"
        	        type="password"
               	    disabled={ !this.state.isPassChange }
               	    onChange={this.validatePass}
               	    value={ this.state.password }
                />
			</div>
			<div className="form-group" key={4}>
				<label>Confirm Password:</label>
		        <input className="form-control"
        	        id="password1"
        	        type="password"
               	    disabled={ !this.state.isPassChange }
               	    onChange={
               	    	this.validatePass
               		}
               		value={ this.state.password1 }
                />
			</div>
			<div className="form-group" key={5}>
				<label>Roles</label>
				{ ['admin','read','write'].map((role, key) => (
					<div className="checkbox" key={key}>
					<label>
					<input type="checkbox"
						value={role}
						checked={user.get('roles', []).includes(role)}
						onChange={onCheckboxClick}
					/>{role}
					</label>
					</div>
				)) }
			</div>
			{this.state.showPassMessage && this.state.isPassChange ?
				(<div className="alert alert-danger">
						{this.state.showPassMessage}
				</div>): null
				}
	      		<button type="button"
		            className="btn btn-primary"
		            onClick={this.onSaveUser}
		            style={{marginRight: 10}}
		            disabled={this.state.disableSave && this.state.isPassChange}>
		        		Save
				</button>
				<button type="reset"
	              	className="btn btn-default"
	              	onClick={this.onCancel}>
	        			Cancel
	      		</button>
			</form>
		)
	}
} 