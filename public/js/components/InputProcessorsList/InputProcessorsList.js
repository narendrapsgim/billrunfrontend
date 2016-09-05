import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Table, PageHeader } from 'react-bootstrap';

//import { getInputProcessors, setInputProcessor } from '../../actions/inputProcessorActions';
import { getList } from '../../actions/listActions';

class InputProcessorsList extends Component {
  constructor(props) {
    super(props);

    this.onClickCell = this.onClickCell.bind(this);
    this.onClickNew = this.onClickNew.bind(this);
  }

  componentDidMount() {
    const params = {
      api: "settings",
      additional: [
        { category: "file_types" },
        { data: JSON.stringify({}) }
      ]
    };
    this.props.dispatch(getList("input_processors", params));
  }
  
  onClickCell(cell_idx, e) {
    const file_type = this.props.inputProcessors.valueSeq().get(cell_idx).get('file_type');
    this.context.router.push({
      pathname: 'input_processor',
      query: {
        file_type,
        action: 'update'
      }
    });
  }
  
  onClickNew() {
    this.context.router.push({
      pathname: 'input_processor',
      query: {
        action: 'new'
      }
    });
  }

  render() {
    const table_headers = (
      <th>File Type</th>
    );

    const table_body = this.props.inputProcessors.map((proc, key) => (
      <tr key={key}>
        <td onClick={this.onClickCell.bind(this, key)}>
          { proc.get('file_type') }
        </td>
      </tr>
    ));

    return (
      <div className="InputProcessorsList">

        <div className="row">
          <div className="col-lg-12">
            <div className="panel panel-default">
              <div className="panel-heading">
                All available input processors
              </div>
              <div className="panel-body">
                <Table responsive hover>
                  <thead>
                    <tr>{ table_headers }</tr>
                  </thead>
                  <tbody>
                    { table_body }
                  </tbody>
                </Table>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-3">
                <a className="btn btn-primary" onClick={this.onClickNew} style={{margin: 15}}>Create New</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

InputProcessorsList.contextTypes = {
  router: React.PropTypes.object.isRequired
};

function mapStateToProps(state, props) {
  return {
    inputProcessors: state.list.get('input_processors') || []
  };
}

export default connect(mapStateToProps)(InputProcessorsList);
