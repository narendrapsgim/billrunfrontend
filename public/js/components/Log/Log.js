import React, { Component } from 'react';
import { connect } from 'react-redux';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

import { getLog } from '../../actions/logActions';

class Log extends Component {
  constructor(props) {
    super(props); 
  }

  componentWillMount() {
    this.props.dispatch(getLog());
  }
  
  render() {
    return (
      <Table selectable={false} fixedHeader={true}>
        <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
          <TableRow>
            <TableHeaderColumn tooltip="Source">Source</TableHeaderColumn>
            <TableHeaderColumn tooltip="Retrieved From">Retreived From</TableHeaderColumn>
            <TableHeaderColumn tooltip="Filename">Filename</TableHeaderColumn>
            <TableHeaderColumn tooltip="Date received">Date received</TableHeaderColumn>
            <TableHeaderColumn tooltip="Date processed">Date processed</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false} stripedRows={true}>
          {this.props.log.map((row, index) => (
             <TableRow key={index}>
               <TableRowColumn>{row.get('source')}</TableRowColumn>
               <TableRowColumn>{row.get('retrieved_from')}</TableRowColumn>
               <TableRowColumn>{row.get('file_name')}</TableRowColumn>
               <TableRowColumn>{row.get('received_time')}</TableRowColumn>
               <TableRowColumn>{row.get('process_time')}</TableRowColumn>
             </TableRow>
           ))}
        </TableBody>
      </Table>
    );
  }
}

function mapStateToProps(state, props) {
  return state;
}

export default connect(mapStateToProps)(Log);
