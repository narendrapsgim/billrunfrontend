import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Table, TableBody, TableHeader, TableFooter, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import ReactPaginate from 'react-paginate';
import Filter from '../Filter';
import Field from '../Field';

import { getPlans } from '../../actions/plansActions';

class PlansList extends Component {
  constructor(props) {
    super(props);

    this.onClickCell = this.onClickCell.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.onFilter = this.onFilter.bind(this);
    this.onNewPlan = this.onNewPlan.bind(this);
    this.onChangeSort = this.onChangeSort.bind(this);

    this.state = {
      page: 0,
      size: 10,
      filter: "",
      sort: ""
    };
  }

  componentDidMount() {
    this.props.dispatch(getPlans());
  }
  
  onClickCell(cell_idx, col_idx, e) {
    let { plans } = this.props;
    let id = plans.valueSeq().get(cell_idx).getIn(['_id', '$id']);
    this.context.router.push({
      pathname: 'plan_setup',
      query: {
        plan_id: id,
        action: 'update'
      }
    });
  }

  buildQuery() {
    const { page, size, filter, sort } = this.state;
    return { page, size, filter, sort };
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

  onNewPlan() {
    this.context.router.push({
      pathname: 'plan_setup',
      query: {
        action: 'new'
      }
    });
  }

  onChangeSort(e) {
    const { value } = e.target;
    this.setState({sort: value}, () => {
      this.props.dispatch(getPlans(this.buildQuery()))
    });
  }
  
  render() {
    let { plans } = this.props;

    const fields = [
      {id: "name", placeholder: "Name"},
      {id: "description", placeholder: "Description"},
    ];

    const sort_fields = [(<option disabled value="-1" key={-1}>Sort</option>),
                         ...fields.map((field, idx) => (
                           <option value={field.id} key={idx}>{field.placeholder}</option>
                         ))];
    
    const table_header = fields.map((field, idx) => (
      <TableHeaderColumn tooltip={field.placeholder} key={idx}>{field.placeholder}</TableHeaderColumn>
    ));
    
    const rows = plans.map((row, key) => (
      <TableRow key={key}>
        {fields.map((field, idx) => (
           <TableRowColumn key={idx}>
             <Field id={field.id} value={row.get(field.id)} coll="Plans" editable={false} />
           </TableRowColumn>
         ))}
      </TableRow>
    ));

    return (
      <div className="PlansList">
        <div className="row" style={{marginBottom: 10}}>
          <div className="col-md-5">
            <Filter fields={fields} onFilter={this.onFilter} />
            {/* <select className="form-control" onChange={this.onChangeSort} defaultValue="-1">
            { sort_fields }
            </select> */}
          </div>
          <div className="col-md-5">
            <div style={{float: "right"}}>
              <RaisedButton primary={true} label="New" onMouseUp={this.onNewPlan} />
            </div>
          </div>
        </div>
        <Table onCellClick={this.onClickCell}>
          <TableHeader displaySelectAll={true} fixedHeader={true}>
            <TableRow>
              { table_header }
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
