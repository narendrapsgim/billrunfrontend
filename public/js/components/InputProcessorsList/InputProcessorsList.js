import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Button } from 'react-bootstrap';
import List from '../List';
import ConfirmModal from '../ConfirmModal';

import { getList, clearList } from '../../actions/listActions';
import { deleteInputProcessor, updateInputProcessorEnabled } from '../../actions/inputProcessorActions';
import { showDanger } from '../../actions/alertsActions';

class InputProcessorsList extends Component {
  constructor(props) {
    super(props);

    this.onClickInputProcessor = this.onClickInputProcessor.bind(this);
    this.onClickNew = this.onClickNew.bind(this);
    this.onSort = this.onSort.bind(this);
    this.buildQuery = this.buildQuery.bind(this);

    this.state = {
      sort: '',
      showConfirmRemove: false,
      inputProcessor: null,
    };
  }

  static propTypes = {
    dispatch: React.PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.dispatch(getList("input_processors", this.buildQuery()));
  }

  componentWillUnmount() {
    this.props.dispatch(clearList('input_processors'));
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
    let query = {
      file_type: input_processor.get('file_type'),
      action: 'update'
    };
    if (input_processor.get('type')) {
      query.type = 'api';
      query.format = input_processor.get('type');
    }
    this.context.router.push({
      pathname: 'input_processor',
      query
    });
  }

  onClickRemove = (inputProcessor) => {
    this.setState({
      showConfirmRemove: true,
      inputProcessor,
    });
  }

  onClickRemoveCancel = () => {
    this.setState({
      showConfirmRemove: false,
      inputProcessor: null,
    });
  }

  onClickRemoveOk = () => {
    const { inputProcessor } = this.state;
    this.setState({
      showConfirmRemove: false,
      inputProcessor: null,
    });
    const fileType = inputProcessor.get('file_type', '');
    this.props.dispatch(deleteInputProcessor(fileType))
    .then(
      (response) => {
        if (response.status) {
          this.props.dispatch(getList('input_processors', this.buildQuery()));
        }
      }
    );
  }

  onClickDisabled = (inputProcessor) => {
    this.updateEnabled(inputProcessor, false);
  }

  onClickEnabled = (inputProcessor) => {
    this.updateEnabled(inputProcessor, true);
  }

  updateEnabled = (inputProcessor, enabled) => {
    const fileType = inputProcessor.get('file_type', '');
    this.props.dispatch(updateInputProcessorEnabled(fileType, enabled))
    .then(
      (response) => {
        if (response.status) {
          this.props.dispatch(getList('input_processors', this.buildQuery()));
        }
      }
    );
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

  parseShowEnable = item => !item.get('enabled', true);
  parseShowDisable = item => !(this.parseShowEnable(item));

  getListActions = () => [
    { type: 'edit', showIcon: true, helpText: 'Edit', onClick: this.onClickInputProcessor, show: true, onClickColumn: 'file_type' },
    { type: 'enable', showIcon: true, helpText: 'Enable', onClick: this.onClickEnabled, show: this.parseShowEnable },
    { type: 'disable', showIcon: true, helpText: 'Disable', onClick: this.onClickDisabled, show: this.parseShowDisable },
    { type: 'remove', showIcon: true, helpText: 'Remove', onClick: this.onClickRemove, show: true },
  ];

  parseInputProcessorStatus = item => (
    item.get('enabled', true) ? 'Enabled' : 'Disabled'
  );

  render() {
    const { inputProcessors } = this.props;
    const { showConfirmRemove, inputProcessor } = this.state;
    const inputProcessorName = inputProcessor ? inputProcessor.get('file_type') : '';
    const removeConfirmMessage = `Are you sure you want to remove input processor "${inputProcessorName}"?`;
    const fields = [
      { id: 'file_type', title: 'Name' },
      { id: 'enabled', title: 'Status', parser: this.parseInputProcessorStatus, cssClass: 'list-status-col' },
    ];
    const actions = this.getListActions();

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
                <List items={inputProcessors} fields={fields} onSort={this.onSort} actions={actions} />
                <ConfirmModal onOk={this.onClickRemoveOk} onCancel={this.onClickRemoveCancel} show={showConfirmRemove} message={removeConfirmMessage} labelOk="Yes" />
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
