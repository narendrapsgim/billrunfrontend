import React, { PropTypes, Component } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { Panel, Col } from 'react-bootstrap';
import CollectionSetup from './CollectionSetup';
import { ActionButtons, Actions, StateIcon, ModalWrapper } from '../Elements';
import { collectionStepsSelector } from '../../selectors/settingsSelector';
import List from '../../components/List';
import { showConfirmModal } from '../../actions/guiStateActions/pageActions';
import { getSettings } from '../../actions/settingsActions';
import {
  removeCollectionStep,
  updateCollectionSteps,
  addCollectionSteps,
  getCollectionSteps,
  saveCollectionSteps,
} from '../../actions/collectionsActions';
import { getConfig } from '../../common/Util';


class CollectionsList extends Component {

  static propTypes = {
    items: PropTypes.instanceOf(Immutable.List),
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    items: Immutable.List(),
  };

  state = {
    editedItem: null,
  };

  componentWillMount() {
    this.props.dispatch(getCollectionSteps());
    this.props.dispatch(getSettings('template_token'));
  }

  onSaveCollectionsSteps = () => {
    this.props.dispatch(saveCollectionSteps()).then(this.afterSaveCollectionsSteps);
  }

  onCloseEditStep = () => {
    this.setState(() => ({ editedItem: null }));
  }

  onChangeEditStep = (path, value) => {
    this.setState(prevState => ({ editedItem: prevState.editedItem.setIn(path, value) }));
  }

  onSaveEditStep = () => {
    const { items } = this.props;
    const { editedItem } = this.state;
    const index = items.findIndex(step => step.get('id', '') === editedItem.get('id', ''));
    if (index === -1) {
      this.props.dispatch(addCollectionSteps(editedItem));
    } else {
      this.props.dispatch(updateCollectionSteps(index, editedItem));
    }
    this.onCloseEditStep();
  }

  afterSaveCollectionsSteps = () => {
    this.props.dispatch(getCollectionSteps());
  }

  onClickEdit = (item) => {
    this.setState(() => ({ editedItem: item }));
  }

  onRemoveCancel = () => {
    this.onCloseEditStep();
  }

  onRemoveOk = (item) => {
    const { items } = this.props;
    const index = items.findIndex(step => step.get('id', '') === item.get('id', ''));
    if (index !== -1) {
      this.props.dispatch(removeCollectionStep(index));
    }
  }

  onClickRemove = (item) => {
    const confirm = {
      message: `Are you sure you want to delete "${item.get('name')}" step?`,
      onOk: () => this.onRemoveOk(item),
      onCancel: () => this.onRemoveCancel(item),
      type: 'delete',
      labelOk: 'Delete',
    };
    this.props.dispatch(showConfirmModal(confirm));
  }

  onAddStep = type => () => {
    const active = getConfig(['collections', 'default_new_step_status'], false);
    this.setState(() => ({
      editedItem: Immutable.Map({ type, active }),
    }));
  }

  parserStatus = item => (<StateIcon status={item.get('active', false) ? 'active' : 'expired'} />);

  parserType = item => (
    <span>
      <i className={`fa ${getConfig(['collections', 'step_types', item.get('type', ''), 'icon'], 'fa-circle-o')}`} />
      &nbsp;
      {getConfig(['collections', 'step_types', item.get('type', ''), 'label'], '')}
    </span>
  );

  parserTriger = item => `Within ${item.get('do_after_days', '')} days`;

  getListFields = () => [
    { id: 'active', title: 'Status', parser: this.parserStatus },
    { id: 'do_after_days', title: 'Trigger after', parser: this.parserTriger },
    { id: 'name', title: 'Step Name' },
    { id: 'type', title: 'Type', parser: this.parserType },
  ]

  getListActions = () => [
    { type: 'edit', showIcon: true, helpText: 'Edit', onClick: this.onClickEdit },
    { type: 'remove', showIcon: true, helpText: 'Remove', onClick: this.onClickRemove },
  ];

  getListSortedItems = () => {
    const { items } = this.props;
    return items.sortBy(item => parseFloat(item.get('do_after_days', 0)));
  };

  renderEventForm = () => {
    const { editedItem } = this.state;
    const { items } = this.props;

    if (editedItem === null) {
      return null;
    }
    const item = items.find(step => step.get('id', '') === editedItem.get('id', ''));
    const title = item
      ? `Edit "${item.get('name', '')}" step`
      : (<span>Create {getConfig(['collections', 'step_types', editedItem.get('type', ''), 'label'], '')} Step</span>);
    return (
      <ModalWrapper
        title={title}
        show={true}
        onOk={this.onSaveEditStep}
        onCancel={this.onCloseEditStep}
        labelOk="Save"
        modalSize="large"
      >
        <CollectionSetup item={editedItem} onChange={this.onChangeEditStep} />
      </ModalWrapper>
    );
  }

  renderPanelHeader = () => {
    const actions = getConfig(['collections', 'step_types'], Immutable.Map())
      .filter(type => type.get('enable', false))
      .map((details, type) => ({
        type: 'add',
        actionStyle: 'primary',
        actionSize: 'xsmall',
        label: `Add new ${getConfig(['collections', 'step_types', type, 'label'], '')} step`,
        onClick: this.onAddStep(type),
      }))
      .toArray();

    return (
      <div>
        &nbsp;
        <div className="pull-right"><Actions actions={actions} /></div>
      </div>
    );
  }
  render() {
    const fields = this.getListFields();
    const actions = this.getListActions();
    const sortedItems = this.getListSortedItems();
    return (
      <div>
        <Col sm={12}>
          <Panel header={this.renderPanelHeader()}>
            <List
              items={sortedItems}
              fields={fields}
              actions={actions}
            />
          </Panel>
        </Col>
        <Col sm={12}>
          <ActionButtons onClickSave={this.onSaveCollectionsSteps} hideCancel={true} />
        </Col>
        {this.renderEventForm()}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  items: collectionStepsSelector(state, props),
});

export default connect(mapStateToProps)(CollectionsList);
