import React, { Component } from 'react';
import { connect } from 'react-redux';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

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
    this.props.onSelectInputProcessor({selected: {}});
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
        <div className="row">
          <div className="col-xs-3">
            <FloatingActionButton mini={true} style={{margin: "20px"}} onMouseUp={this.onClickNew}>
              <ContentAdd />
            </FloatingActionButton>
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
