import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import Immutable from 'immutable';
import { Button } from 'react-bootstrap';
import changeCase from 'change-case';
import List from '../List';


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
    defaultListFields: ['sid', 'firstname', 'lastname', 'plan', 'plan_activation', 'services', 'address'],
    aid: '',
  };


  planActivationParser = (subscription) => {
    const date = subscription.get('plan_activation', null);
    return date ? moment(date).format(globalSetting.datetimeFormat) : '';
  }

  servicesParser = subscription => subscription
    .get('services', Immutable.List())
    .map( service => service.get('name','') )
    .join(', ');

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
            return { id: fieldname, parser: this.planActivationParser };
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

  render() {
    const { items } = this.props;
    const fields = this.getFields();
    return (
      <div className="row">
        <div className="col-lg-12">
          <List items={items} fields={fields} edit={true} onClickEdit={this.props.onClickEdit} />
          <Button bsSize="xsmall" className="btn-primary" onClick={this.onClickNew}><i className="fa fa-plus" />&nbsp;Add New Subscription</Button>
        </div>
      </div>
    );
  }
}
