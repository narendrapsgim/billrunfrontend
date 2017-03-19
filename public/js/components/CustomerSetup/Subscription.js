import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { Form, FormGroup, ControlLabel, Col, Button, Panel } from 'react-bootstrap';
import Select from 'react-select';
import moment from 'moment';
import { titleCase } from 'change-case';
import ActionButtons from '../Elements/ActionButtons';
import Field from '../Field';
import Credit from '../Credit/Credit';
import { getItemId, getFieldName } from '../../common/Util';


export default class Subscription extends Component {

  static propTypes = {
    subscription: PropTypes.oneOfType([
      PropTypes.instanceOf(Immutable.Map),
      null,
    ]),
    settings: PropTypes.instanceOf(Immutable.List), // Subscriptions Fields
    allPlans: PropTypes.instanceOf(Immutable.List),
    allServices: PropTypes.instanceOf(Immutable.List),
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  };

  static defaultProps = {
    subscription: null,
    settings: Immutable.List(),
    allPlans: Immutable.List(),
    allServices: Immutable.List(),
  };

  constructor(props) {
    super(props);
    this.state = {
      systemFields: this.initSystemFields(),
      customFields: this.initCustomFields(),
    };
  }

  state = {
    showCreditCharge: false,
  };

  initSystemFields = () => {
    const { subscription } = this.props;
    if (!subscription) {
      return Immutable.Map();
    }
    const services = subscription.get('services', Immutable.List()) || Immutable.List();
    return Immutable.Map({
      plan: subscription.get('plan', ''),
      services: services.map(service => service.get('name', '')),
    });
  }

  initCustomFields = () => {
    const { settings, subscription } = this.props;
    if (!subscription) {
      return Immutable.Map();
    }
    const FieldData = Immutable.Record({
      value: '',
      type: 'text',
      label: '',
      params: null,
    });

    return Immutable.Map({}).withMutations((customFieldsWithMutations) => {
      settings.filter(this.filterCustomFields).forEach((field) => {
        const fieldData = new FieldData({
          value: subscription.get(field.get('field_name'), ''),
          type: field.get('select_list', false) ? 'select' : 'text',
          label: field.get('title', ''),
          params: field.get('select_list', false) ? field.get('select_options', '').split(',') : null,
        });
        customFieldsWithMutations.set(field.get('field_name', 'defaultFieldName'), fieldData);
      });
    });
  }

  onChangePlan = (plan) => {
    const { systemFields } = this.state;
    const newSystemFields = systemFields.set('plan', plan);
    this.setState({ systemFields: newSystemFields });
  };

  onChangeService = (services) => {
    const { systemFields } = this.state;
    const servicesList = (services.length) ? services.split(',') : [];
    const newSystemFields = systemFields.set('services', servicesList);
    this.setState({ systemFields: newSystemFields });
  }

  onSave = () => {
    const { subscription } = this.props;
    const { systemFields, customFields } = this.state;
    const mode = getItemId(subscription, false) ? 'closeandnew' : 'create';

    const data = subscription.withMutations((subscriptionWithMutations) => {
      systemFields.forEach((value, key) => {
        if (key === 'services') {
          const services = [];
          value.forEach((serviceName) => {
            const subscriptionServices = subscription.get('services', Immutable.List()) || Immutable.List();
            let entry = subscriptionServices.find(service => service.get('name') === serviceName);
            if (!entry) {
              entry = Immutable.Map({
                name: serviceName,
                from: moment().toISOString(),
                to: subscription.get('to'),
              });
            }
            services.push(entry);
          });
          subscriptionWithMutations.set(key, services);
        } else {
          subscriptionWithMutations.set(key, value);
        }
      });
      customFields.forEach((fieldData, key) => {
        subscriptionWithMutations.set(key, fieldData.get('value'));
      });
      subscriptionWithMutations.delete('from');
    });
    this.props.onSave(data, mode);
  };

  onChangeCustomFields = (e) => {
    const { value, id } = e.target;
    this.setCustomFieldsValue([id], value);
  }

  onChangeCustomFieldsSelect = id => (value) => {
    this.setCustomFieldsValue([id], value);
  }

  setCustomFieldsValue = (path, value) => {
    const { customFields } = this.state;
    const newCustomFields = customFields.setIn([...path, 'value'], value);
    this.setState({ customFields: newCustomFields });
  }

  getSelectValues = options => options
    .map(option => ({
      value: option,
      label: option,
    })
  )

  getAvailablePlans = () => {
    const { allPlans } = this.props;
    return allPlans.map(plan => ({
      value: plan.get('name'),
      label: plan.get('name'),
    }));
  }

  getAvailableServices = () => {
    const { allServices } = this.props;
    return allServices.map(service => ({
      value: service.get('name'),
      label: service.get('name'),
    }));
  }

  filterCustomFields = (field) => {
    const hiddenFields = ['plan', 'services'];
    const isCustomField = !hiddenFields.includes(field.get('field_name'));
    const isEditable = field.get('editable', false);
    const isMandatory = field.get('mandatory', false);
    const shouldDisplayed = field.get('display', true);
    return isCustomField && (isEditable || isMandatory) && shouldDisplayed;
    // PHP .../application/views/internalpaypage/index.phtml condition
    // if ((empty($c['display']) && empty($c['mandatory']))
    //  || $c['field_name'] === 'plan'
    //  || (isset($c['editable']) && !$c['editable'])
    // ) continue;
  }

  renderSystemFields = () => {
    const { systemFields } = this.state;
    const availablePlans = this.getAvailablePlans().toJS();
    const availableServices = this.getAvailableServices().toJS();
    const services = systemFields.get('services', []).join(',');
    const plan = systemFields.get('plan', '');

    return ([(
      <FormGroup key="plan">
        <Col componentClass={ControlLabel} sm={2}>Plan</Col>
        <Col sm={7}>
          <Select
            options={availablePlans}
            value={plan}
            onChange={this.onChangePlan}
            allowCreate={true}
          />
        </Col>
      </FormGroup>
      ), (
      <FormGroup key="services">
        <Col componentClass={ControlLabel} sm={2}>Services</Col>
        <Col sm={7}>
          <Select
            multi={true}
            value={services}
            options={availableServices}
            onChange={this.onChangeService}
          />
        </Col>
      </FormGroup>
    )]);
  }

  renderCustomFields = () => {
    const { customFields } = this.state;
    return customFields.map((fieldData, key) => {
      const { label, value, params, type } = fieldData;
      return (
        <FormGroup key={key}>
          <Col componentClass={ControlLabel} sm={2}>
            { label.length > 0 ? label : titleCase(getFieldName(key, 'subscription')) }
          </Col>
          <Col sm={7}>
            { type === 'select'
              ? (
                <Select
                  options={this.getSelectValues(params)}
                  value={value}
                  onChange={this.onChangeCustomFieldsSelect(key)}
                />
                )
              : <Field value={value} onChange={this.onChangeCustomFields} id={key} />
            }
          </Col>
        </FormGroup>
      );
    }).toArray();
  }

  onShowCreditCharge = () => {
    this.setState({ showCreditCharge: true });
  }

  onCloseCreditCharge = () => {
    this.setState({ showCreditCharge: false });
  }

  renderCreditCharge = () => {
    const { subscription } = this.props;
    const { showCreditCharge } = this.state;
    const sid = subscription.get('sid', '');
    const aid = subscription.get('aid', '');
    return (
      <div>
        <Button bsSize="xsmall" className="btn-primary" onClick={this.onShowCreditCharge}>Manual charge / refund</Button>
        { showCreditCharge && (<Credit aid={aid} sid={sid} onClose={this.onCloseCreditCharge} />) }
      </div>
    );
  }

  render() {
    const { subscription } = this.props;
    if (!subscription) {
      return (null);
    }
    const isEdit = getItemId(subscription, false) !== false;
    const title = isEdit ? 'Edit Subscription' : 'Create New Subscription';
    return (
      <div className="Subscription">
        <Panel header={title}>
          <Form horizontal>
            { this.renderSystemFields() }
            <hr />
            { this.renderCustomFields() }
            { isEdit && <hr /> }
            { isEdit && this.renderCreditCharge() }
          </Form>
        </Panel>
        <ActionButtons onClickSave={this.onSave} onClickCancel={this.props.onCancel} />
      </div>
    );
  }
}
