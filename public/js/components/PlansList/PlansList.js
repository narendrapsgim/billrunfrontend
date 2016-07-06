import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Table, TableBody, TableHeader, TableFooter, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import ReactPaginate from 'react-paginate';
import Filter from '../Filter';

import { getPlans } from '../../actions/plansActions';

class PlansList extends Component {
  constructor(props) {
    super(props);

    this.onClickCell = this.onClickCell.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.onFilter = this.onFilter.bind(this);

    this.state = {
      page: 1,
      size: 10,
      filter: ""
    };
  }

  componentDidMount() {
    this.props.dispatch(getPlans());
  }
  
  onClickCell(cell_idx, col_idx, e) {
    let { plans } = this.props;
    let id = plans.valueSeq().get(cell_idx).getIn(['_id', '$id']);;
    this.context.router.push({
      pathname: 'plan_setup',
      query: {plan_id: id}
    });
  }
  
  buildQuery() {
    const { page, size, filter } = this.state;
    return { page, size, filter };
  }  
  
  handlePageClick(data) {
    let page = data.selected + 1;
    this.setState({page}, () => {
      this.props.dispatch(getPlans(this.buildQuery()))
    });
  }

  onFilter(filter) {
    this.setState({filter}, () => {
      this.props.dispatch(getPlans(this.buildQuery()))
    });
  }
  
  render() {
    let { plans } = this.props;
    
    let rows = plans.map((row, index) => (
      <TableRow key={index}>
        <TableRowColumn>{row.get('name')}</TableRowColumn>
        <TableRowColumn>{row.get('technical_name')}</TableRowColumn>
        <TableRowColumn>{row.get('invoice_label')}</TableRowColumn>
      </TableRow>
    ));

    const fields = [
      {id: "name", placeholder: "Name"},
      {id: "technical_name", placeholder: "Technical Name"},
      {id: "invoice_label", placeholder: "Invoice Label"}
    ];

    return (
      <div className="PlansList">
        <Filter fields={fields} onFilter={this.onFilter} />
        <Table onCellClick={this.onClickCell}>
          <TableHeader displaySelectAll={true} fixedHeader={true}>
            <TableRow>
              <TableHeaderColumn tooltip="Name">Name</TableHeaderColumn>
              <TableHeaderColumn tooltip="Technical Name">Technical Name</TableHeaderColumn>
              <TableHeaderColumn tooltip="Invoice Label">Invoice Label</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody>
            { rows }
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableRowColumn style={{textAlign: 'center'}}>
                <ReactPaginate previousLabel={"previous"}
                               nextLabel={"next"}
                               breakLabel={<a>...</a>}
                               pageNum={this.state.page + 5}
                               marginPagesDisplayed={2}
                               pageRangeDisplayed={5}
                               clickCallback={this.handlePageClick}
                               containerClassName={"pagination"}
                               subContainerClassName={"pages pagination"}
                               activeClassName={"active"} />
              </TableRowColumn>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    );
  }
}

PlansList.contextTypes = {
  router: React.PropTypes.object.isRequired
};

function mapStateToProps(state, props) {
  return state;
}

export default connect(mapStateToProps)(PlansList);
