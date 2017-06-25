import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Immutable from 'immutable';
import moment from 'moment';
import EntityList from '../EntityList';
import { LoadingItemPlaceholder, ModalWrapper } from '../Elements';
import Importer from '../Importer';
import { getSettings } from '../../actions/settingsActions';
import { clearItems } from '../../actions/entityListActions';
import { accountFieldsSelector } from '../../selectors/settingsSelector';
import { getFieldName, getConfig } from '../../common/Util';


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

  state = {
    showImport: false,
    refreshString: '',
  }

  componentDidMount() {
    const { accountFields } = this.props;
    if (accountFields === null || accountFields.isEmpty()) {
      this.props.dispatch(getSettings(['subscribers']));
    }
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
  }, {
    type: 'refresh',
  }, {
    type: 'import',
    label: 'Import',
    actionStyle: 'default',
    showIcon: true,
    onClick: this.onClickImprt,
    actionSize: 'xsmall',
    actionClass: 'btn-primary',
  }];

  getActions = () => [
    { type: 'edit' },
  ];

  onCloseImprt = () => {
    this.setState({
      showImport: false,
      refreshString: moment().format(), //refetch list items after import
    });
  }

  onClickImprt = () => {
    this.setState({
      showImport: true,
    });
  }

  render() {
    const { accountFields } = this.props;
    const { showImport, refreshString } = this.state;

    if (accountFields === null) {
      return (<LoadingItemPlaceholder />);
    }

    const fields = this.getListFields();
    const listActions = this.getListActions();
    const actions = this.getActions();
    const apiDateFormat = getConfig('apiDateFormat', 'YYYY-MM-DD');
    const defaultFrom = moment().format(apiDateFormat);
    const defaultTo = moment().add(100, 'years').format(apiDateFormat);

    return (
      <div>
        <EntityList
          collection="accounts"
          itemsType="customers"
          itemType="customer"
          tableFields={fields}
          filterFields={fields}
          actions={actions}
          listActions={listActions}
          refreshString={refreshString}
        />
        <ModalWrapper show={showImport} title="Import" onHide={this.onCloseImprt}>
          <Importer
            entityOptions={['customer', 'subscription']}
            onFinish={this.onCloseImprt}
            defaultValues={{
              customer: [{
                key: 'from',
                value: defaultFrom,
              }, {
                key: 'to',
                value: defaultTo,
              }],
              subscription: [{
                key: 'from',
                value: defaultFrom,
              }, {
                key: 'to',
                value: defaultTo,
              }],
            }}
          />
        </ModalWrapper>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  accountFields: accountFieldsSelector(state, props),
});

export default withRouter(connect(mapStateToProps)(CustomersList));
