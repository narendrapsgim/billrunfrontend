import React, { Component } from 'react';
import { connect } from 'react-redux';

/* COMPONENTS */
import Pager from '../Pager';
import Filter from '../Filter';
import List from '../List';
import { Button } from "react-bootstrap";

/* ACTIONS */
import { getList } from '../../actions/listActions';

class UserList extends Component {
  
  constructor(props){
    super(props);
    this.buildQuery = this.buildQuery.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.onFilter = this.onFilter.bind(this);
    this.onClickUser = this.onClickUser.bind(this);
    this.onClickNewUser = this.onClickNewUser.bind(this);

    this.state = {
      page: 0,
      size: 10,
      sort: '',
      filter: ""
    };
  }

  buildQuery() {
    const { page, size, sort, filter } = this.state;
    return {
      api: "find",
      params: [
	{ collection: "users" },
	{ size },
	{ page },
	{ sort },
	{ query: filter }
      ]
    };
  }

  onFilter(filter) {
    this.setState({filter}, () => {
      this.props.dispatch(getList('users', this.buildQuery()))
    });
  }

  handlePageClick(page) {
    this.setState({page}, () => {
      this.props.dispatch(getList('users', this.buildQuery()))
    });
  }

  onSort = (sort) => {
    this.setState({sort}, () => {
      this.props.dispatch(getList('users', this.buildQuery()))
    });
  }

  onClickUser(user){
    this.context.router.push({
      pathname: "user",
      query: {
	action: "update",
	userId: user.getIn(['_id', '$id'], '')
      }
    });
  }

  onClickNewUser(user) {
    this.context.router.push({
      pathname: "user",
      query: {
	action: "new"
      }
    });
  }

  render() {
    const { users } = this.props;

    const roleParser = (entity) => {
      return entity.get('roles').join(', ');
    };

    const fields = [
      {id: "username", placeholder: "Username", sort: true},
      {id: "roles", placeholder: "Roles", parser: roleParser}
    ];

    const base = this.props.location.query.base ? JSON.parse(this.props.location.query.base) : {};

    return (
      <div>
	<div className="row">
	  <div className="col-lg-12">
	    <div className="panel panel-default">
	      <div className="panel-heading">
		List of all  users
		<div className="pull-right">
		  <Button bsSize="xsmall" className="btn-primary" onClick={this.onClickNewUser}><i className="fa fa-plus"/>&nbsp;Add New</Button>
		</div>
	      </div>
	      <div className="panel-body">
	        <Filter fields={fields} onFilter={this.onFilter} base={base} />
	        <List items={users} fields={fields} editField="username" edit={true} onClickEdit={ this.onClickUser } onSort={this.onSort} />
	      </div>
	    </div>
	  </div>
	</div>

	<Pager onClick={this.handlePageClick}
	       size={this.state.size}
	       count={users.size || 0} />  

      </div>
    );
  }
}

UserList.contextTypes = {
  router: React.PropTypes.object.isRequired
};

function mapStateToProps(state, props) {
  return { users: state.list.get('users') || [] };
}

export default connect(mapStateToProps)(UserList);
