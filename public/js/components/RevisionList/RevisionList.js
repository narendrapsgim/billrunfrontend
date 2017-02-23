import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Immutable from 'immutable';
import moment from 'moment';
import { ConfirmModal, StateIcon } from '../Elements';
import List from '../../components/List';
import { getItemDateValue } from '../../common/Util';
import { showSuccess } from '../../actions/alertsActions';
import { deleteEntity } from '../../actions/entityActions';
import { getRevisions } from '../../actions/entityListActions';


class RevisionList extends Component {

  static propTypes = {
    items: PropTypes.instanceOf(Immutable.List),
    onSelectItem: PropTypes.func,
    onDeleteItem: PropTypes.func,
    itemName: PropTypes.string.isRequired,
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    items: Immutable.List(),
    onSelectItem: () => {},
    onDeleteItem: () => {},
  };

  state = {
    showConfirmRemove: false,
    itemToRemove: null,
  }

  isItemEditable = item => getItemDateValue(item, 'to', moment(0)).isAfter(moment());
  isItemRemovable = item => getItemDateValue(item, 'from', moment(0)).isAfter(moment());

  parseDate = item => getItemDateValue(item, 'from', moment(0)).format(globalSetting.dateFormat);
  parserState = item => (
    <StateIcon
      from={getItemDateValue(item, 'from', moment(0)).toISOString()}
      to={getItemDateValue(item, 'to', moment(0)).toISOString()}
    />
  );
  parseEditShow = item => this.isItemEditable(item);
  parseViewShow = item => !this.isItemEditable(item);
  parseRemoveEnable = item => this.isItemRemovable(item);

  onClickEdit = (item) => {
    const { itemName } = this.props;
    const itemId = item.getIn(['_id', '$id']);
    const itemType = globalSetting.systemItems[itemName].itemType;
    const itemsType = globalSetting.systemItems[itemName].itemsType;
    this.props.onSelectItem();
    this.props.router.push(`${itemsType}/${itemType}/${itemId}`);
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

  onClickRemoveOk = () => {
    const { itemName } = this.props;
    const { itemToRemove } = this.state;
    const collection = globalSetting.systemItems[itemName].collection;
    this.props.dispatch(deleteEntity(collection, itemToRemove)).then(this.afterRemove);
  }

  afterRemove = (response) => {
    const { itemToRemove } = this.state;
    const { itemName } = this.props;
    if (response.status) {
      this.props.dispatch(showSuccess('Revision was removed'));
      const collection = globalSetting.systemItems[itemName].collection;
      const uniqueField = globalSetting.systemItems[itemName].uniqueField;
      const key = itemToRemove.get(uniqueField, '');
      this.props.dispatch(getRevisions(collection, uniqueField, key)); // refetch revision list because item was (changed in / added to) list
      const stayOnPage = this.props.onDeleteItem(itemToRemove);
      if (stayOnPage) {
        this.onClickRemoveClose();
      }
    }
  }

  getListFields = () => [
    { id: 'state', parser: this.parserState, cssClass: 'state' },
    { id: 'from', title: 'Start date', parser: this.parseDate },
  ]

  getListActions = () => [
    { type: 'view', showIcon: true, helpText: 'View', onClick: this.onClickEdit, show: this.parseViewShow, onClickColumn: 'from' },
    { type: 'edit', showIcon: true, helpText: 'Edit', onClick: this.onClickEdit, show: this.parseEditShow, onClickColumn: 'from' },
    { type: 'remove', showIcon: true, helpText: 'Remove', onClick: this.onClickRemove, enable: this.parseRemoveEnable },
  ]

  render() {
    const { items } = this.props;
    const { showConfirmRemove } = this.state;
    const fields = this.getListFields();
    const actions = this.getListActions();
    const removeConfirmMessage = 'Are you sure you want to remove revision ?';
    return (
      <div>
        <List items={items} fields={fields} edit={false} actions={actions} />
        <ConfirmModal onOk={this.onClickRemoveOk} onCancel={this.onClickRemoveClose} show={showConfirmRemove} message={removeConfirmMessage} labelOk="Yes" />
      </div>
    );
  }
}

export default withRouter(connect()(RevisionList));
