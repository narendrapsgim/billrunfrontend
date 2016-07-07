import React, { Component } from 'react';
import { connect } from 'react-redux';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

import { getInputProcessors } from '../../actions/inputProcessorActions';

class InputProcessorsList extends Component {
  constructor(props) {
    super(props);

    this.onClickCell = this.onClickCell.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(getInputProcessors());
  }
  
  onClickCell(cell_idx, col_idx, e) {
    const selected = this.props.list.valueSeq().get(cell_idx);
    this.props.dispatch(setInputProcessor(selected));
  }
  
  render() {
    const table_header = (
      <TableHeaderColumn tooltip="File Type">File Type</TableHeaderColumn>      
    );

    const rows = this.props.list.map((proc, key) => (
      <TableRow key={key}>
        <TableRowColumn>
          { proc.get('file_type') }
        </TableRowColumn>
      </TableRow>
    ));

    return (
      <div className="InputProcessorsList">
        <Table onCellClick={this.onClickCell}>
          <TableHeader displaySelectAll={true} fixedHeader={true}>
            <TableRow>
              { table_header }
            </TableRow>
          </TableHeader>
          <TableBody>
            { rows }
          </TableBody>
        </Table>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {list: state.inputProcessors};
}

export default connect(mapStateToProps)(InputProcessorsList);
