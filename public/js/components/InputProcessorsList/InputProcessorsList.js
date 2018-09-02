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
      showConfirmReceiverEnable: false,
      showConfirmProcessorEnable: false,
      showConfirmReceiverDisable: false,
      showConfirmProcessorDisable: false,
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

  onClickProcessorEnabled = (inputProcessor) => {
    this.setState({
      showConfirmProcessorEnable: true,
      inputProcessor,
    });
  }

  onClickReceiverEnabled = (inputProcessor) => {
    this.setState({
      showConfirmReceiverEnable: true,
      inputProcessor,
    });
  }

  onClickEnableProcessorCancel = () => {
    this.setState({
      showConfirmProcessorEnable: false,
      inputProcessor: null,
    });
  }

  onClickEnableReceiverCancel = () => {
    this.setState({
      showConfirmReceiverEnable: false,
      inputProcessor: null,
    });
  }

  onClickEnableProcessorOk = () => {
    const { inputProcessor } = this.state;
    this.setState({
      showConfirmProcessorEnable: false,
      inputProcessor: null,
    });
    this.updateProcessorEnabled(inputProcessor, true);
  }

  onClickEnableReceiverOk = () => {
    const { inputProcessor } = this.state;
    this.setState({
      showConfirmReceiverEnable: false,
      inputProcessor: null,
    });
    this.updateReceiverEnabled(inputProcessor, true);
  }

  onClickProcessorDisabled = (inputProcessor) => {
    this.setState({
      showConfirmProcessorDisable: true,
      inputProcessor,
    });
  }

  onClickReceiverDisabled = (inputProcessor) => {
    this.setState({
      showConfirmReceiverDisable: true,
      inputProcessor,
    });
  }

  onClickDisableProcessorCancel = () => {
    this.setState({
      showConfirmProcessorDisable: false,
      inputProcessor: null,
    });
  }

  onClickDisableReceiverCancel = () => {
    this.setState({
      showConfirmReceiverDisable: false,
      inputProcessor: null,
    });
  }

  onClickDisableProcessorOk = () => {
    const { inputProcessor } = this.state;
    this.setState({
      showConfirmProcessorDisable: false,
      inputProcessor: null,
    });
    this.updateProcessorEnabled(inputProcessor, false);
  }

  onClickDisableReceiverOk = () => {
    const { inputProcessor } = this.state;
    this.setState({
      showConfirmReceiverDisable: false,
      inputProcessor: null,
    });
    this.updateReceiverEnabled(inputProcessor, false);
  }

  updateProcessorEnabled = (inputProcessor, enabled) => {
    const fileType = inputProcessor.get('file_type', '');
    this.props.dispatch(updateInputProcessorEnabled(fileType, 'processor', enabled))
    .then(
      (response) => {
        if (response.status) {
          this.props.dispatch(getList('input_processors', this.buildQuery()));
        }
      }
    );
  }

  updateReceiverEnabled = (inputProcessor, enabled) => {
    const fileType = inputProcessor.get('file_type', '');
    this.props.dispatch(updateInputProcessorEnabled(fileType, 'receiver', enabled))
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

  parseShowReceiverEnable = item => !item.get('receiver_enabled', true);
  parseShowReceiverDisable = item => !(this.parseShowReceiverEnable(item));

  parseShowProcessorEnable = item => !item.get('processor_enabled', true);
  parseShowProcessorDisable = item => !(this.parseShowProcessorEnable(item));

  getListActions = () => [
    { type: 'edit', showIcon: true, helpText: 'Edit', onClick: this.onClickInputProcessor, show: true, onClickColumn: 'file_type' },
    { type: 'remove', showIcon: true, helpText: 'Remove', onClick: this.onClickRemove, show: true },
  ];

  parseInputProcessorReceiveStatus = (item) => {
    const actions = [
      { type: 'enable', showIcon: true, helpText: 'Enable Receive', onClick: this.onClickReceiverEnabled, show: this.parseShowReceiverEnable },
      { type: 'disable', showIcon: true, helpText: 'Disable Receive', onClick: this.onClickReceiverDisabled, show: this.parseShowReceiverDisable },
    ];
    return (
      <Actions actions={actions} data={item} />
    );
  }

  parseInputProcessorProcessStatus = (item) => {
    const actions = [
      { type: 'enable', helpText: 'Enable Process', onClick: this.onClickProcessorEnabled, show: this.parseShowProcessorEnable },
      { type: 'disable', helpText: 'Disable Process', onClick: this.onClickProcessorDisabled, show: this.parseShowProcessorDisable },
    ];
    return (
      <Actions actions={actions} data={item} />
    );
  };

  render() {
    const { inputProcessors } = this.props;
    const { showConfirmRemove, showConfirmReceiverEnable, showConfirmProcessorEnable, showConfirmReceiverDisable, showConfirmProcessorDisable, inputProcessor } = this.state;
    const inputProcessorName = inputProcessor ? inputProcessor.get('file_type') : '';
    const removeConfirmMessage = `Are you sure you want to remove input processor "${inputProcessorName}"?`;
    const enableReceiverConfirmMessage = `Are you sure you want to enable receiver for input processor "${inputProcessorName}"?`;
    const disableReceiverConfirmMessage = `Are you sure you want to disable receiver for input processor "${inputProcessorName}"?`;
    const enableProcessorConfirmMessage = `Are you sure you want to enable processor for input processor "${inputProcessorName}"?`;
    const disableProcessorConfirmMessage = `Are you sure you want to disable processor for input processor "${inputProcessorName}"?`;
    const fields = [
      { id: 'file_type', title: 'Name' },
      { id: 'enabled', title: 'Receiver', parser: this.parseInputProcessorReceiveStatus, cssClass: 'td-actions' },
      { id: 'enabled', title: 'Processor', parser: this.parseInputProcessorProcessStatus, cssClass: 'td-actions' },
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
                <ConfirmModal onOk={this.onClickEnableProcessorOk} onCancel={this.onClickEnableProcessorCancel} show={showConfirmProcessorEnable} message={enableProcessorConfirmMessage} labelOk="Yes" />
                <ConfirmModal onOk={this.onClickDisableProcessorOk} onCancel={this.onClickDisableProcessorCancel} show={showConfirmProcessorDisable} message={disableProcessorConfirmMessage} labelOk="Yes" />
                <ConfirmModal onOk={this.onClickEnableReceiverOk} onCancel={this.onClickEnableReceiverCancel} show={showConfirmReceiverEnable} message={enableReceiverConfirmMessage} labelOk="Yes" />
                <ConfirmModal onOk={this.onClickDisableReceiverOk} onCancel={this.onClickDisableReceiverCancel} show={showConfirmReceiverDisable} message={disableReceiverConfirmMessage} labelOk="Yes" />
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
