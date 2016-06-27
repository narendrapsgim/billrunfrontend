import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { Table, TableHeader, TableRow, TableHeaderColumn, TableRowColumn, TableBody, TableFooter } from 'material-ui/Table';
import Pager from '../Pager';

import List from '../List';

import { getUsages } from '../../actions/usageActions';
import { showProgressBar, hideProgressBar } from '../../actions/progressbarActions.js';

class UsageList extends Component {
  constructor(props) {
    super(props);

    this.onPaginationClick = this.onPaginationClick.bind(this);
    
    this.state = {
      currentPage: 1
    };
  }

  componentWillMount() {
    this.props.dispatch(getUsages());
  }

  onPaginationClick(e) {
    let page = this.state.currentPage;
    let value = e.currentTarget.value;

    if(_.isInteger(parseInt(value))){
      page = parseInt(value);
    } else if(value == 'back' && page > 1){
      page --;
    } else if(value == 'forward' && page < this.state.totalPages){
      page++;
    }

    this.props.dispatch(getUsages(page));
    this.setState({
      currentPage: page
    });
  }
  /* 
     render() {
     let { usages } = this.props;
     let { currentPage } = this.state;

     return (
     <div>
     <Table fixedHeader={true}
     fixedFooter={true}
     selectable={false}
     height={'500px'}>
     <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
     <TableRow>
     <TableHeaderColumn tooltip="Account">Account</TableHeaderColumn>
     <TableHeaderColumn tooltip="Subscription">Subscription</TableHeaderColumn>
     <TableHeaderColumn tooltip="Plan">Plan</TableHeaderColumn>
     <TableHeaderColumn tooltip="Charge">Charge</TableHeaderColumn>
     </TableRow>
     </TableHeader>
     <TableBody displayRowCheckbox={false} stripedRows={true}>
     {usages.valueSeq().map((row, index) => (
     <TableRow key={index}>
     <TableRowColumn>{row.get('aid')}</TableRowColumn>
     <TableRowColumn>{row.get('sid')}</TableRowColumn>
     <TableRowColumn>{row.get('plan')}</TableRowColumn>
     <TableRowColumn>{row.get('aprice')}</TableRowColumn>
     </TableRow>
     ))}
     </TableBody>
     <TableFooter>
     <TableRow>
     <TableRowColumn style={{textAlign: 'center'}}>
     <Pager totalPages={usages.size} currentPage={currentPage} onPaginationClick={this.onPaginationClick} />
     </TableRowColumn>
     </TableRow>
     </TableFooter>
     </Table>
     </div>
     );
     } */

  render() {
    let settings = {
      url: globalSetting.serverUrl + "/api/find?collection=plans",
      fields : [
        {key: '_id', label: 'ID', type: 'mongoid', hidden: true},
        {key: 'technical_name', label: 'Label', filter: {}, sortable: true},
        {key: 'invoice_type', label: 'Type', sortable: true},
        {key: 'grouping', label: 'Grouping', filter: {}},
        {key: 'price', label: 'Price', type: 'price', filter: {}, sortable: true},
        {key: 'forceCommitment', label: 'Force Commitment', type: 'boolean'},
        {key: 'from', label: 'From',  type: 'urt', sortable: true },
        {key: 'date', label: 'Date', type:'urt' ,filter:  { defaultValue: (moment()), query:{'from': {'$lte':1}, 'to': {'$gt': 1} }  ,valuePath:{ 'from': {'$lte':null}, 'to': {'$gt': null} } } , hidden: true}
      ],
      pagination: {itemsPerPage: 10}
    };
    return (
      <List settings={settings}
            page={1}
            showProgressBar={showProgressBar}
            collection="plans" />
    );
  }
}

function mapStateToProps(state, props) {
  return state;
}

export default connect(mapStateToProps)(UsageList);
