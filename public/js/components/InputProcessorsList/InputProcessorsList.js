import React, { Component } from 'react';
import { connect } from 'react-redux';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

import { getInputProcessors, setInputProcessor } from '../../actions/inputProcessorActions';

class InputProcessorsList extends Component {
  constructor(props) {
    super(props);

    this.onClickCell = this.onClickCell.bind(this);
    this.onClickNew = this.onClickNew.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(getInputProcessors());
  }
  
  onClickCell(cell_idx, col_idx, e) {
    const selected = this.props.list.valueSeq().get(cell_idx).get('file_type');
    this.props.onSelectInputProcessor(selected);
  }
  
  onClickNew() {
    this.props.onSelectInputProcessor(true);
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
      <div className="InputProcessorsList bordered-container">
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
        <div className="row">
          <div className="col-xs-3">
            <a className="btn btn-primary" onClick={this.onClickNew} style={{margin: 15}}>Create New</a>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {list: state.inputProcessors};
}

export default connect(mapStateToProps)(InputProcessorsList);
