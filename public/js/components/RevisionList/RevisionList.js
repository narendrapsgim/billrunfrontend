import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Immutable from 'immutable';
import moment from 'moment';
import { lowerCase, sentenceCase } from 'change-case';
import { ConfirmModal, StateIcon } from '../Elements';
import CloseActionBox from '../Entity/CloseActionBox';
import List from '../../components/List';
import { getItemDateValue, getConfig, isItemClosed, getItemId } from '../../common/Util';
import { showSuccess } from '../../actions/alertsActions';
import { deleteEntity } from '../../actions/entityActions';
import { getRevisions } from '../../actions/entityListActions';


class RevisionList extends Component {

  static propTypes = {
    items: PropTypes.instanceOf(Immutable.List),
    onSelectItem: PropTypes.func,
    onDeleteItem: PropTypes.func,
    onCloseItem: PropTypes.func,
    itemName: PropTypes.string.isRequired,
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    onActionEdit: PropTypes.func,
    onActionClone: PropTypes.func,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    items: Immutable.List(),
    onSelectItem: () => {},
    onDeleteItem: () => {},
    onCloseItem: () => {},
  };

  state = {
    showConfirmRemove: false,
    itemToRemove: null,
  }

  isItemEditable = item => ['future', 'active'].includes(item.getIn(['revision_info', 'status'], ''));

  isItemRemovable = item => ['future', 'active'].includes(item.getIn(['revision_info', 'status'], ''));

  isItemActive = item => ['active'].includes(item.getIn(['revision_info', 'status'], ''));

  parseEditShow = item => this.isItemEditable(item);

  parseViewShow = item => !this.isItemEditable(item);

  parseRemoveEnable = item => this.isItemRemovable(item);

  parserState = item => (<StateIcon status={item.getIn(['revision_info', 'status'], '')} />);

  parseFromDate = (item) => {
    const fromDate = getItemDateValue(item, 'from', null);
    if (moment.isMoment(fromDate)) {
      return fromDate.format(globalSetting.dateFormat);
    }
    return '-';
  };

  parseToDate = (item) => {
    const toDate = getItemDateValue(item, 'to', null);
    const statusWithToDate = ['expired', 'active_with_future'].includes(item.getIn(['revision_info', 'status'], ''));
    if (moment.isMoment(toDate) && (isItemClosed(item) || statusWithToDate)) {
      return toDate.format(globalSetting.dateFormat);
    }
    return '-';
  };

  onClickEdit = (item) => {
    const { itemName } = this.props;
    this.props.onSelectItem();
    if (!this.props.onActionEdit) {
      const itemId = getItemId(item, '');
      const itemType = getConfig(['systemItems', itemName, 'itemType'], '');
      const itemsType = getConfig(['systemItems', itemName, 'itemsType'], '');
      this.props.router.push(`${itemsType}/${itemType}/${itemId}`);
    } else {
      this.props.onActionEdit(item, itemName);
    }
  };

  onClickRemove = (item) => {
    this.setState({
      showConfirmRemove: true,
      itemToRemove: item,
    });
  }

  onClickRemoveClose = () => {
    this.setState({
      showConfirmRemove: false,
      itemToRemove: null,
    });
  }

  onClickClone = (item) => {
    const { itemName } = this.props;
    this.props.onSelectItem();
    if (!this.props.onActionClone) {
      const itemId = getItemId(item, '');
      const itemType = getConfig(['systemItems', itemName, 'itemType'], '');
      const itemsType = getConfig(['systemItems', itemName, 'itemsType'], '');
      this.props.router.push({
        pathname: `${itemsType}/${itemType}/${itemId}`,
        query: {
          action: 'clone',
        },
      });
    } else {
      this.props.onActionClone(item, itemName, 'clone');
    }
  }

  onClickRemoveOk = () => {
    const { itemName } = this.props;
    const { itemToRemove } = this.state;
    const collection = getConfig(['systemItems', itemName, 'collection'], '');
    this.props.dispatch(deleteEntity(collection, itemToRemove)).then(this.afterRemove);
  }

  afterRemove = (response) => {
    const { itemToRemove } = this.state;
    const { itemName } = this.props;
    if (response.status) {
      this.props.dispatch(showSuccess('Revision was removed'));
      const collection = getConfig(['systemItems', itemName, 'collection'], '');
      const uniqueField = getConfig(['systemItems', itemName, 'uniqueField'], '');
      const key = itemToRemove.get(uniqueField, '');
      const removedRevisionId = getItemId(itemToRemove);
      this.props.dispatch(getRevisions(collection, uniqueField, key)); // refetch revision list because item was (changed in / added to) list
      this.onClickRemoveClose();
      this.props.onDeleteItem(removedRevisionId);
    }
  }

  getActionHelpText = (type) => {
    const { itemName } = this.props;
    switch (lowerCase(type)) {
      case 'clone':
        return `Clone as new ${getConfig(['systemItems', itemName, 'itemName'], 'item')}`;
      case 'remove':
        return 'Remove revision';
      case 'edit':
        return 'Edit revision';
      case 'view':
        return 'View revision details';
      default:
        return sentenceCase(type);
    }
  }

  getListFields = () => [
    { id: 'state', parser: this.parserState, cssClass: 'state' },
    { id: 'from', title: 'Start date', parser: this.parseFromDate, cssClass: 'short-date' },
    { id: 'to', title: 'To date', parser: this.parseToDate },
  ]

  getListActions = () => [
    { type: 'view', helpText: this.getActionHelpText('view'), onClick: this.onClickEdit, show: this.parseViewShow, onClickColumn: 'from' },
    { type: 'edit', helpText: this.getActionHelpText('edit'), onClick: this.onClickEdit, show: this.parseEditShow, onClickColumn: 'from' },
    { type: 'clone', helpText: this.getActionHelpText('clone'), onClick: this.onClickClone },
    { type: 'remove', helpText: this.getActionHelpText('remove'), onClick: this.onClickRemove, enable: this.parseRemoveEnable },
  ]

  render() {
    const { items, itemName } = this.props;
    const { showConfirmRemove } = this.state;
    const fields = this.getListFields();
    const actions = this.getListActions();
    const activeItem = items.find(this.isItemActive);
    const removeConfirmMessage = 'Are you sure you want to remove this revision?';
    return (
      <div>
        <List items={items} fields={fields} edit={false} actions={actions} />
        { activeItem &&
          <CloseActionBox
            itemName={itemName}
            item={activeItem}
            onCloseItem={this.props.onCloseItem}
          />
        }
        <ConfirmModal onOk={this.onClickRemoveOk} onCancel={this.onClickRemoveClose} show={showConfirmRemove} message={removeConfirmMessage} labelOk="Yes" />
      </div>
    );
  }
}

export default withRouter(connect()(RevisionList));
