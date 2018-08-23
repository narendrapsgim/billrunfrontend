import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Button } from 'react-bootstrap';
import List from '../List';
import { ConfirmModal, Actions } from '../Elements';
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
      showConfirmEnable: false,
      showConfirmDisable: false,
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

  onClickEnabled = (inputProcessor) => {
    this.setState({
      showConfirmEnable: true,
      inputProcessor,
    });
  }

  onClickEnableCancel = () => {
    this.setState({
      showConfirmEnable: false,
      inputProcessor: null,
    });
  }

  onClickEnableOk = () => {
    const { inputProcessor } = this.state;
    this.setState({
      showConfirmEnable: false,
      inputProcessor: null,
    });
    this.updateEnabled(inputProcessor, true);
  }

  onClickDisabled = (inputProcessor) => {
    this.setState({
      showConfirmDisable: true,
      inputProcessor,
    });
  }

  onClickDisableCancel = () => {
    this.setState({
      showConfirmDisable: false,
      inputProcessor: null,
    });
  }

  onClickDisableOk = () => {
    const { inputProcessor } = this.state;
    this.setState({
      showConfirmDisable: false,
      inputProcessor: null,
    });
    this.updateEnabled(inputProcessor, false);
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

  parseShowEnable = item => !item.get('receive_enabled', true);
  parseShowDisable = item => !(this.parseShowEnable(item));

  getListActions = () => [
    { type: 'edit', showIcon: true, helpText: 'Edit', onClick: this.onClickInputProcessor, show: true, onClickColumn: 'file_type' },
    { type: 'remove', showIcon: true, helpText: 'Remove', onClick: this.onClickRemove, show: true },
  ];
/**
     type, label, data, actionStyle, showIcon, actionSize, actionClass
 */
  parseInputProcessorReceiveStatus = (item) => {
    const receiveEnabled = item.get('receive_enabled', true) ? 'enable' : 'disable';
    const actions = [
      { type: 'enable', showIcon: true, helpText: 'Enable Receive', onClick: this.onClickEnabled, show: this.parseShowEnable },
      { type: 'disable', showIcon: true, helpText: 'Disable Receive', onClick: this.onClickDisabled, show: this.parseShowDisable },
    ];
    return (
      <Actions actions={actions} data={item} />
    );
  }

  parseInputProcessorProcessStatus = item => {
    const processEnabled = item.get('process_enabled', true) ? 'enabled' : 'disabled';
    const actions = [
      { type: 'enable', showIcon: true, helpText: 'Enable Process', onClick: this.onClickEnabled, show: this.parseShowEnable },
      { type: 'disable', showIcon: true, helpText: 'Disable Process', onClick: this.onClickDisabled, show: this.parseShowDisable },
    ];
    return (
      <Actions actions={actions} data={item} />
    );
  };

  render() {
    const { inputProcessors } = this.props;
    const { showConfirmRemove, showConfirmEnable, showConfirmDisable, inputProcessor } = this.state;
    const inputProcessorName = inputProcessor ? inputProcessor.get('file_type') : '';
    const removeConfirmMessage = `Are you sure you want to remove input processor "${inputProcessorName}"?`;
    const enableConfirmMessage = `Are you sure you want to enable input processor "${inputProcessorName}"?`;
    const disableConfirmMessage = `Are you sure you want to disable input processor "${inputProcessorName}"?`;
    const fields = [
      { id: 'file_type', title: 'Name' },
      { id: 'enabled', title: 'Receive Status', parser: this.parseInputProcessorReceiveStatus, cssClass: 'list-status-col-2' },
      { id: 'enabled', title: 'Process Status', parser: this.parseInputProcessorProcessStatus, cssClass: 'list-status-col-2' },
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
                <ConfirmModal onOk={this.onClickEnableOk} onCancel={this.onClickEnableCancel} show={showConfirmEnable} message={enableConfirmMessage} labelOk="Yes" />
                <ConfirmModal onOk={this.onClickDisableOk} onCancel={this.onClickDisableCancel} show={showConfirmDisable} message={disableConfirmMessage} labelOk="Yes" />
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
