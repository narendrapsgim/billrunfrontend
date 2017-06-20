import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { titleCase } from 'change-case';
import EntityList from '../EntityList';
import { ConfirmModal } from '../Elements';
import { getConfig, getFieldName } from '../../common/Util';
import { showSuccess } from '../../actions/alertsActions';
import { clearItems } from '../../actions/entityListActions';
import { deleteReport } from '../../actions/reportsActions';


class ReportsList extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  }

  static defaultProps = {

  }

  state = {
    showConfirmDelete: false,
    itemToDelete: null,
  }

  parseEntityName = (item) => {
    const entity = item.get('entity', '');
    return titleCase(getConfig(['systemItems', entity, 'itemName'], 'entity'));
  }

  parseEntityType = item => getFieldName(`report_type_${item.get('type')}`, 'report');

  getFilterFields = () => ([
    { id: 'key', placeholder: 'Name' },
    { id: 'user', placeholder: 'User' },
  ]);

  getTableFields = () => ([
    { id: 'key', title: 'Name', sort: true },
    { id: 'entity', title: 'Entity', sort: true, parser: this.parseEntityName },
    { id: 'type', title: 'Type', sort: true, parser: this.parseEntityType },
    { id: 'user', title: 'User', sort: true },
    { id: 'from', title: 'Modified', type: 'datetime', cssClass: 'long-date', sort: true },
  ]);

  getProjectFields = () => ({
    key: 1,
    entity: 1,
    user: 1,
    from: 1,
    type: 1,
  });

  onAskDelete = (item) => {
    this.setState({
      showConfirmDelete: true,
      itemToDelete: item,
      confirmDeleteMessage: `Are you sure you want to delete "${item.get('key', '')}" report ?`,
    });
  }

  onDeleteClose = () => {
    this.setState({
      showConfirmDelete: false,
      itemToDelete: null,
      confirmDeleteMessage: '',
    });
  }

  onDeleteOk = () => {
    const { itemToDelete } = this.state;
    this.setState({ progress: true });
    this.props.dispatch(deleteReport(itemToDelete)).then(this.afterDelete);
  }

  afterDelete = (response) => {
    this.onDeleteClose();
    if (response.status) {
      const itemsType = getConfig(['systemItems', 'report', 'itemsType'], '');
      this.props.dispatch(showSuccess('The report was deleted'));
      this.props.dispatch(clearItems(itemsType)); // refetch items list because item was (changed in / added to) list
    }
  }

  getActions = () => ([
    { type: 'view' },
    { type: 'edit', onClickColumn: null },
    { type: 'remove', showIcon: true, onClick: this.onAskDelete },
  ]);

  render() {
    const { showConfirmDelete, confirmDeleteMessage } = this.state;
    const filterFields = this.getFilterFields();
    const tableFields = this.getTableFields();
    const actions = this.getActions();
    const projectFields = this.getProjectFields();
    return (
      <div>
        <EntityList
          collection="reports"
          itemType="report"
          itemsType="reports"
          api="get"
          filterFields={filterFields}
          tableFields={tableFields}
          projectFields={projectFields}
          actions={actions}
        />
        <ConfirmModal
          onOk={this.onDeleteOk}
          onCancel={this.onDeleteClose}
          show={showConfirmDelete}
          message={confirmDeleteMessage}
          labelOk="Yes"
        />
      </div>
    );
  }

}

export default connect()(ReportsList);
