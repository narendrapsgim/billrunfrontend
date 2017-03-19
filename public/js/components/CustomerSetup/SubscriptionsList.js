import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import changeCase from 'change-case';
import List from '../List';
import { CreateButton } from '../Elements';
import StateDetails from '../EntityList/StateDetails';
import { getItemDateValue, getConfig } from '../../common/Util';


export default class SubscriptionsList extends Component {

  static propTypes = {
    items: PropTypes.instanceOf(Immutable.Iterable),
    settings: PropTypes.instanceOf(Immutable.List),
    aid: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    defaultListFields: PropTypes.arrayOf(PropTypes.string),
    onNew: PropTypes.func.isRequired,
    onClickEdit: PropTypes.func.isRequired,
  };

  static defaultProps = {
    items: Immutable.List(),
    settings: Immutable.List(),
    defaultListFields: [],
    aid: '',
  };


  planActivationParser = (subscription) => {
    const date = getItemDateValue(subscription, 'plan_activation', false);
    return date ? date.format(getConfig('dateFormat', 'DD/MM/YYYY')) : '';
  };

  servicesParser = (subscription) => {
    const services = subscription.get('services', Immutable.List()) || Immutable.List();
    return services.map(service => service.get('name', '')).join(', ');
  }

  addressParser = (subscription) => {
    if (subscription.get('country', '').length > 0) {
      return `${subscription.get('address', '')} ,${subscription.get('country', '')}`;
    }
    return subscription.get('address', '');
  }

  onClickNew = (e) => {
    const { aid } = this.props;
    this.props.onNew(aid, e);
  }

  getFields = () => {
    const { settings, defaultListFields } = this.props;
    return settings
      .filter(field => (field.get('show_in_list', false) || defaultListFields.includes(field.get('field_name', ''))))
      .map((field) => {
        const fieldname = field.get('field_name');
        switch (fieldname) {
          case 'plan_activation':
            return { id: fieldname, parser: this.planActivationParser, cssClass: 'long-date text-center' };
          case 'services':
            return { id: fieldname, parser: this.servicesParser };
          case 'address':
            return { id: fieldname, parser: this.addressParser };
          case 'sid':
            return { id: fieldname, title: 'ID' };
          default: {
            let title = fieldname;
            if (fieldname === 'firstname') {
              title = 'first name';
            } else if (fieldname === 'lastname') {
              title = 'last name';
            }
            return { id: fieldname, title: changeCase.sentenceCase(title) };
          }
        }
      })
      .toArray();
  }

  getListActions = () => [
    { type: 'edit', helpText: 'Edit', onClick: this.props.onClickEdit, onClickColumn: 'sid' },
  ]

  parserState = item => (
    <StateDetails item={item} itemName="subscriber" />
  );

  addStateColumn = fields => ([
    { id: 'state', parser: this.parserState, cssClass: 'state' },
    ...fields,
  ])

  render() {
    const { items } = this.props;
    const fields = this.addStateColumn(this.getFields());
    const actions = this.getListActions();
    return (
      <div className="row">
        <div className="col-lg-12">
          <List items={items} fields={fields} actions={actions} />
          <CreateButton onClick={this.onClickNew} type="Subscription" />
        </div>
      </div>
    );
  }
}
