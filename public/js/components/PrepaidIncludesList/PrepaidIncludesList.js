import React from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { withRouter } from 'react-router';

import { getList } from '../../actions/listActions';

import { Row, Col, Panel } from 'react-bootstrap';
import List from '../List';
import Filter from '../Filter';
import Pager from '../Pager';

class PrepaidIncludesList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      size: 10,
      page: 0,
      sort: '',
      filter: {}
    };
  }

  buildQuery = () => {
    const { size, page, sort, filter } = this.state;
    return {
      api: 'find',
      params: [
	{ collection: "prepaidincludes" },
	{ size },
	{ page },
	{ sort },
	{ query: filter }
      ]
    };
  }

  getPPList = () => {
    this.props.dispatch(getList("prepaid_includes", this.buildQuery()));
  }
  
  handlePageClick = (page) => {
    this.setState({page}, this.getPPList);
  }
  
  onFilter = (filter) => {
    this.setState({filter, page: 0}, this.getPPList);
  }

  onSort = (sort) => {
    this.setState({sort}, this.getPPList);
  }

  onClickPP = (pp) => {
    const pp_id = pp.getIn(['_id', '$id']);
    this.props.router.push({
      pathname: "prepaid_include",
      query: {
	action: "update",
	pp_id
      }
    });
  }
  
  render() {
    const { pp_includes } = this.props;
    const fields = [
      { id: 'name' },
      { id: 'charging_by', showFilter: false },
      { id: 'charging_by_usaget', showFilter: false },
      { id: 'priority', showFilter: false }
    ];

    return (
      <div className="PrepaidIncludesList">
	<Row>
	  <Col lg={12} md={12}>
	    <Panel header={<h3> List of all available Prepaid Includes </h3>}>
	      <Filter fields={ fields } onFilter={ this.onFilter } />
	      <List items={ pp_includes } fields={ fields } edit={ true } editField="name" onClickEdit={ this.onClickPP } onSort={ this.onSort } />
	    </Panel>
	  </Col>
	</Row>
	<div>
	  <Pager onClick={ this.handlePageClick }
		 size={ this.state.size }
		 count={ pp_includes.size || 0 } />
	</div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    pp_includes: state.list.get('prepaid_includes', Immutable.List())
  };
}

export default withRouter(connect(mapStateToProps)(PrepaidIncludesList));
