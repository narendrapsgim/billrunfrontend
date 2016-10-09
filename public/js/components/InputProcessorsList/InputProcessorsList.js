import React, { Component } from 'react';
import { connect } from 'react-redux';

import List from '../List';
import { Button } from "react-bootstrap";

import { getList } from '../../actions/listActions';

class InputProcessorsList extends Component {
  constructor(props) {
    super(props);

    this.onClickInputProcessor = this.onClickInputProcessor.bind(this);
    this.onClickNew = this.onClickNew.bind(this);
    this.onSort = this.onSort.bind(this);
    this.buildQuery = this.buildQuery.bind(this);

    this.state = {
      sort: ''
    };
  }

  componentDidMount() {
    this.props.dispatch(getList("input_processors", this.buildQuery()));
  }

  buildQuery() {
    return {
      api: "settings",
      params: [
        { category: "file_types" },
	{ sort: this.state.sort },
        { data: JSON.stringify({}) }
      ]
    };
  }
  
  onClickInputProcessor(input_processor, e) {
    this.context.router.push({
      pathname: 'input_processor',
      query: {
        file_type: input_processor.get('file_type'),
        action: 'update'
      }
    });
  }
  
  onClickNew() {
    this.context.router.push({
      pathname: 'select_input_processor_template',
      query: {
        action: 'new'
      }
    });
  }


  onSort(sort) {
    this.setState({sort}, () => {
      this.props.dispatch(getList('input_processors', this.buildQuery()));
    });
  }

  render() {
    const { inputProcessors } = this.props;
    const fields = [
      { id: "file_type", title: "Name" }
    ];

    return (
      <div className="InputProcessorsList">

        <div className="row">
          <div className="col-lg-12">
            <div className="panel panel-default">
              <div className="panel-heading">
                All available input processors
                <div className="pull-right">
                  <Button bsSize="xsmall" className="btn-primary" onClick={this.onClickNew}><i className="fa fa-plus"/>&nbsp;Add New</Button>
                </div>
              </div>
              <div className="panel-body">
                <List items={inputProcessors} fields={fields} edit={true} onClickEdit={this.onClickInputProcessor} onSort={this.onSort} />
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
