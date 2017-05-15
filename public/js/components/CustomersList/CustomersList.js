import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import EntityList from '../EntityList';
import LoadingItemPlaceholder from '../Elements/LoadingItemPlaceholder';
import { getSettings } from '../../actions/settingsActions';


class CustomersList extends Component {

  static propTypes = {
    accountFields: PropTypes.oneOfType([
      PropTypes.instanceOf(Immutable.List),
      null,
    ]),
    accountAllwaysShownFields: PropTypes.instanceOf(Immutable.List),
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

  render() {
    const { accountFields, accountAllwaysShownFields } = this.props;

    if (accountFields === null) {
      return (<LoadingItemPlaceholder />);
    }

    const fields = accountFields
      .filter(field => field.get('show_in_list', false) || accountAllwaysShownFields.includes(field.get('field_name', '')))
      .map(field => ({
        id: field.get('field_name'),
        placeholder: field.get('title', field.get('field_name')),
        sort: true,
        type: field.get('field_name') === 'aid' ? 'number' : 'text',
      }))
      .toJS();
    fields.push({ id: 'to', placeholder: 'To', showFilter: false, display: false, type: 'datetime' });

    const actions = [
      { type: 'edit' },
    ];

    return (
      <EntityList
        collection="accounts"
        itemsType="customers"
        itemType="customer"
        tableFields={fields}
        filterFields={fields}
        actions={actions}
      />
    );
  }
}

const mapStateToProps = state => ({
  accountFields: state.settings.getIn(['subscribers', 'account', 'fields']),
});

export default connect(mapStateToProps)(CustomersList);
