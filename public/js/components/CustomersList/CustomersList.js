import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Immutable from 'immutable';
import EntityList from '../EntityList';
import LoadingItemPlaceholder from '../Elements/LoadingItemPlaceholder';
import { getSettings } from '../../actions/settingsActions';
import { accountFieldsSelector } from '../../selectors/settingsSelector';
import { getFieldName } from '../../common/Util';


class CustomersList extends Component {

  static propTypes = {
    accountFields: PropTypes.instanceOf(Immutable.List),
    accountAllwaysShownFields: PropTypes.instanceOf(Immutable.List),
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    accountFields: null,
    accountAllwaysShownFields: Immutable.List(['aid', 'firstname', 'lastname']),
  };

  componentDidMount() {
    const { accountFields } = this.props;
    if (accountFields === null || accountFields.isEmpty()) {
      this.props.dispatch(getSettings('subscribers'));
    }
  }

  onClickNew = () => {
    this.props.router.push('customers/customer');
  }

  getListFields = () => {
    const { accountFields, accountAllwaysShownFields } = this.props;
    return accountFields
      .filter(field => field.get('show_in_list', false) || accountAllwaysShownFields.includes(field.get('field_name', '')))
      .map(field => ({
        id: field.get('field_name'),
        placeholder: field.get('title', getFieldName(field.get('field_name', ''), 'account')),
        sort: true,
        type: field.get('field_name') === 'aid' ? 'number' : 'text',
      }))
      .toJS();
  }

  getListActions = () => [{
    type: 'add',
    label: 'Add New',
    actionStyle: 'default',
    showIcon: true,
    onClick: this.onClickNew,
    actionSize: 'xsmall',
    actionClass: 'btn-primary',
  },
  ];

  getActions = () => [
    { type: 'edit' },
  ];

  render() {
    const { accountFields } = this.props;

    if (accountFields === null) {
      return (<LoadingItemPlaceholder />);
    }

    const fields = this.getListFields();
    const listActions = this.getListActions();
    const actions = this.getActions();
    return (
      <EntityList
        collection="accounts"
        itemsType="customers"
        itemType="customer"
        tableFields={fields}
        filterFields={fields}
        actions={actions}
        listActions={listActions}
      />
    );
  }
}

const mapStateToProps = (state, props) => ({
  accountFields: accountFieldsSelector(state, props),
});

export default withRouter(connect(mapStateToProps)(CustomersList));
