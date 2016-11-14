import React, { Component } from 'react';
import { connect } from 'react-redux';
import List from '../List';
import { DropdownButton, MenuItem, Button } from "react-bootstrap";
import Immutable from 'immutable';
import { getList } from '../../actions/listActions';

class ExportGeneratorsList extends Component {
  constructor(props) {
    super(props);

    this.onClickExportGenerator = this.onClickExportGenerator.bind(this);
    this.onClickNew = this.onClickNew.bind(this);
    this.onSort = this.onSort.bind(this);
    this.buildQuery = this.buildQuery.bind(this);

    this.state = {
      sort: ''
    };
  }

  componentDidMount() {
    this.props.dispatch(getList("export_generators", this.buildQuery()));
  }

  buildQuery() {
    return {
      api: "settings",
      params: [
        { category: "export_generators" },
	{ sort: this.state.sort },
        { data: JSON.stringify({}) }
      ]
    };
  }
  
  onClickExportGenerator(export_generator) {
    this.context.router.push({
      pathname: 'export_generator',
      query: {
        file_type: export_generator.get('name'),
        action: 'update'
      }
    });
  }
  
  onClickNew() {
    this.context.router.push({
      pathname: 'export_generator',
      query: {
        action: 'new'
      }
    });
  }

  onSort(sort) {
    this.setState({sort}, () => {
      this.props.dispatch(getList('export_generators', this.buildQuery()));
    });
  }

  render() {
    const { exportGenerators } = this.props;
    const fields = [
      { id: "name", title: "Name" }
    ];

    return (
      <div className="ExportGeneratorsList">
        <div className="row">
          <div className="col-lg-12">
            <div className="panel panel-default">
              <div className="panel-heading">
                <span>
                  All available Export Generators
                </span>
                <div className="pull-right">
                  <Button bsSize="xsmall" className="btn-primary" onClick={this.onClickNew}><i className="fa fa-plus"></i>&nbsp;Add New</Button>
                </div>
              </div>
              <div className="panel-body">
                <List items={exportGenerators} fields={fields} edit={true} onClickEdit={this.onClickExportGenerator} onSort={this.onSort} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ExportGeneratorsList.contextTypes = {
  router: React.PropTypes.object.isRequired
};

function mapStateToProps(state, props) {
  return {
    exportGenerators: state.list.get('export_generators', Immutable.List())
  };
}

export default connect(mapStateToProps)(ExportGeneratorsList);
