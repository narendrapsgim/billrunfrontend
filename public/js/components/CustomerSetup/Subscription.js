import React, { Component, PropTypes } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { Form, FormGroup, ControlLabel, Col, Panel } from 'react-bootstrap';
import Select from 'react-select';
import moment from 'moment';
import SubscriptionServicesDetails from './SubscriptionServicesDetails';
import ActionButtons from '../Elements/ActionButtons';
import Actions from '../Elements/Actions';
import Field from '../Field';
import { EntityRevisionDetails } from '../Entity';
import EntityFields from '../Entity/EntityFields';
import PlaysSelector from '../Plays/PlaysSelector';
import {
  getConfig,
  getItemId,
  getItemMode,
  getItemDateValue,
  buildPageTitle,
  toImmutableList,
} from '../../common/Util';

class Subscription extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    subscription: PropTypes.instanceOf(Immutable.Map),
    revisions: PropTypes.instanceOf(Immutable.List),
    settings: PropTypes.instanceOf(Immutable.List), // Subscriptions Fields
    allPlans: PropTypes.instanceOf(Immutable.List),
    allServices: PropTypes.instanceOf(Immutable.List),
    mode: PropTypes.string,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    clearRevisions: PropTypes.func.isRequired,
    clearList: PropTypes.func.isRequired,
    getSubscription: PropTypes.func.isRequired,
  }

  static defaultProps = {
    subscription: Immutable.Map(),
    mode: 'create',
    revisions: Immutable.List(),
    settings: Immutable.List(),
    allPlans: Immutable.List(),
    allServices: Immutable.List(),
  }

  constructor(props) {
    super(props);
    this.state = {
      subscription: props.subscription,
      progress: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!Immutable.is(this.props.subscription, nextProps.subscription)) {
      this.setState({ subscription: nextProps.subscription });
    }
  }

  onSave = () => {
    const { subscription } = this.state;
    const { mode } = this.props;
    // prosses subscriber before save
    const subscriptionToSave = compose(
      this.removeServiceUiFlags,
      // Now update services dates runs of sub. From field change,
      // can be uncommet to be shure that servises date are correct if bugs will be found
      // this.updateServicesDates,
    )(subscription);

    this.props.onSave(subscriptionToSave, mode);
  }

  updateServicesDates = (subscription, newFrom = null) => {
    const { subscription: originSubscription } = this.props;
    const originServices = originSubscription.get('services', Immutable.List()) || Immutable.List();
    // const services = subscription.get('services', Immutable.List()) || Immutable.List();
    const from = newFrom || getItemDateValue(subscription, 'from').toISOString();

    return subscription.update('services', Immutable.List(), (services) => {
      if (!services) {
        return Immutable.List();
      }
      return services.map((service) => {
        const serviceType = this.getServiceType(service); // 'normal', 'quantitative', 'balance_period'
        const existingService = originServices.find(originService => originService.getIn(['ui_flags', 'serviceId'], '') === service.getIn(['ui_flags', 'serviceId'], ''));
        const newService = service.getIn(['ui_flags', 'serviceId'], '') === '';

        switch (serviceType) {
          case 'normal': // New -> update to SUB from.
            return (newService) ? service.set('from', from) : service;

          case 'quantitative': { // New or Existing with change -> update to SUB from.
            const existingServiceWithChange = existingService && existingService.get('quantity', '') !== service.get('quantity', '');
            return (newService || existingServiceWithChange) ? service.set('from', from) : service;
          }

          case 'balance_period': {
            const existingServiceWithChange = existingService && !moment(existingService.get('from', '')).isSame(moment(service.get('from', '')), 'days');
            const incorrectForm = moment(service.get('from', '')).isBefore(from, 'days');
            // New or Existing with change and incorrect FROM -> Update from to SUB from
            return ((newService || existingServiceWithChange) && incorrectForm) ? service.set('from', from) : service;
          }

          default:
            return service;
        }
      });
    });
  }

  removeServiceUiFlags = subscription => subscription.update('services', Immutable.List(),
    services => (services ? services.map(service => service.delete('ui_flags')) : Immutable.List()),
  );

  onChangeFrom = (path, value) => {
    const { subscription } = this.state;
    const newSubscription = this.updateServicesDates(subscription.setIn(path, value));
    this.setState({ subscription: newSubscription });
  }

  onChangePlan = (plan) => {
    this.updateSubscriptionField(['plan'], plan);
  }

  onChangePlay = (play) => {
    this.updateSubscriptionField(['play'], play);
    this.filterSubscriptionServicesByPlay(play);
    this.filterSubscriptionPlanByPlay(play);
  }

  onChangeServiceDetails = (index, key, value) => {
    const path = Array.isArray(key) ? key : [key];
    this.updateSubscriptionField(['services', index, ...path], value);
  }

  onRemoveService = (index) => {
    const { subscription } = this.state;
    const services = subscription.get('services', Immutable.List()) || Immutable.List();
    const newServices = services.delete(index);
    this.updateSubscriptionField(['services'], newServices);
  }

  filterSubscriptionPlanByPlay = (play) => {
    const { subscription } = this.state;
    const { allPlans } = this.props;
    const selectedPlanPlays = allPlans.find(
      plan => plan.get('name', '') === subscription.get('plan', ''),
      null, Immutable.Map(),
    ).get('play', Immutable.List());
    if (!selectedPlanPlays.isEmpty() && !selectedPlanPlays.includes(play)) {
      this.updateSubscriptionField(['plan'], '');
    }
  }

  filterSubscriptionServicesByPlay = (play) => {
    const { allServices } = this.props;
    const { subscription } = this.state;
    const services = subscription.get('services', Immutable.List()) || Immutable.List();
    const newServices = services.filter((service) => {
      const servicePlays = allServices.find(
        option => option.get('name', '') === service.get('name', ''),
        null, Immutable.Map(),
      ).get('play', Immutable.List());
      return servicePlays.isEmpty() || servicePlays.includes(play);
    });
    this.updateSubscriptionField(['services'], newServices);
  }

  getServiceType = (service) => {
    const { allServices } = this.props;
    const serviceName = (Immutable.Map.isMap(service)) ? service.get('name', '') : service;
    const serviceOption = allServices.find(option => option.get('name', '') === serviceName);
    if (!serviceOption) {
      return null;
    }
    if (serviceOption.get('quantitative', false)) {
      return 'quantitative';
    }
    if (serviceOption.get('balance_period', 'default') !== 'default') {
      return 'balance_period';
    }
    return 'normal';
  }

  onAddService = (name) => {
    const { subscription } = this.state;
    const newService = this.initService(name);
    const services = subscription.get('services', Immutable.List()) || Immutable.List();
    const newServices = services.push(newService);
    this.updateSubscriptionField(['services'], newServices);
  }

  initService = (serviceName) => {
    const { subscription: originSubscription } = this.props;
    const { subscription } = this.state;
    const type = this.getServiceType(serviceName);
    const from = getItemDateValue(subscription, 'from').format('YYYY-MM-DD');
    const to = getItemDateValue(subscription, 'to', moment().add(100, 'years')).toISOString();
    const newService = Immutable.Map({ name: serviceName, from, to });
    const originServices = originSubscription.get('services', Immutable.List()) || Immutable.List();
    const existingService = originServices.find(originService => originService.get('name', '') === serviceName);

    switch (type) {
      case 'quantitative': {
        return (existingService && existingService.get('quantity', '') === 1) ? existingService : newService.set('quantity', 1);
      }
      case 'balance_period': {
        return newService.setIn(['ui_flags', 'balance_period'], true);
      }
      default: {
        return existingService || newService;
      }
    }
  }

  onChangeService = (services) => {
    const { subscription } = this.state;
    if (!services.length) {
      this.updateSubscriptionField(['services'], Immutable.List());
      return;
    }
    const servicesNames = Immutable.Set(services.split(','));
    const originServices = subscription.get('services', Immutable.List()) || Immutable.List();
    const originServicesNames = Immutable.Set(originServices.map(originServic => originServic.get('name', '')));

    const addedServices = servicesNames.filter(item => !originServicesNames.has(item));
    const removedServices = originServicesNames.filter(item => !servicesNames.has(item));

    if (addedServices.size) {
      addedServices.forEach((newServiceName) => { this.onAddService(newServiceName); });
    }
    if (removedServices.size) {
      removedServices.forEach((removeService) => {
        originServices.forEach((originService, index) => {
          if (originService.get('name', '') === removeService) {
            this.onRemoveService(index);
          }
        });
      });
    }
  }

  updateSubscriptionField = (path, value) => {
    this.setState(prevState => ({ subscription: prevState.subscription.setIn(path, value) }));
  }

  formatSelectOptions = items => items.map(item => ({
    value: item.get('name', ''),
    label: item.get('description', item.get('name', '')),
  }));

  getAvailablePlans = () => {
    const { subscription } = this.state;
    const { allPlans } = this.props;
    const play = subscription.get('play', false);
    if ([false, ''].includes(play)) {
      return this.formatSelectOptions(allPlans);
    }
    return this.formatSelectOptions(allPlans
      .filter(allPlan => allPlan.get('play', Immutable.List()).isEmpty() || allPlan.get('play', Immutable.List()).includes(play)),
    );
  }

  getPlanIncludedServices = (planName) => {
    if (planName === '') {
      return '-';
    }
    const { allPlans } = this.props;
    const selectedPlan = allPlans.find(plan => plan.get('name', '') === planName, null, Immutable.Map());
    const includedServices = selectedPlan.getIn(['include', 'services'], Immutable.List());
    return includedServices.size ? includedServices.join(', ') : '-';
  }

  getAvailableServices = () => {
    const { subscription } = this.state;
    const { allServices } = this.props;
    const play = subscription.get('play', false);
    if ([false, ''].includes(play)) {
      return this.formatSelectOptions(allServices);
    }
    return this.formatSelectOptions(allServices
      .filter(allService => allService.get('play', Immutable.List()).isEmpty() || allService.get('play', Immutable.List()).includes(play)),
    );
  }

  filterCustomFields = (field) => {
    const hiddenFields = ['plan', 'services', 'play'];
    const isCustomField = !hiddenFields.includes(field.get('field_name'));
    const isEditable = field.get('editable', false);
    const isMandatory = field.get('mandatory', false);
    const shouldDisplayed = field.get('display', true);

    return isCustomField &&
    (isEditable || isMandatory) &&
    shouldDisplayed;
    // PHP .../application/views/internalpaypage/index.phtml condition
    // if ((empty($c['display']) && empty($c['mandatory']))
    //  || $c['field_name'] === 'plan'
    //  || (isset($c['editable']) && !$c['editable'])
    // ) continue;
  }

  renderSystemFields = (editable) => {
    const { subscription } = this.state;
    const plansOptions = this.getAvailablePlans().toJS();
    const servicesOptions = this.getAvailableServices().toJS();
    const services = subscription.get('services', Immutable.List()) || Immutable.List();
    const servicesList = Immutable.Set(services.map(service => service.get('name', ''))).join(',');
    const plan = subscription.get('plan', '');
    return ([
      (<PlaysSelector
        entity={subscription}
        editable={editable}
        mandatory={true}
        onChange={this.onChangePlay}
      />),
      (<FormGroup key="plan">
        <Col componentClass={ControlLabel}sm={3} lg={2}>Plan <span className="danger-red"> *</span></Col>
        <Col sm={8} lg={9}>
          { editable
            ? <Select
              options={plansOptions}
              value={plan}
              onChange={this.onChangePlan}
            />
            : <Field value={plan} editable={false} />
          }
        </Col>
      </FormGroup>
    ), (
      <FormGroup key="includedServices">
        <Col componentClass={ControlLabel} sm={3} lg={2}>Included Services</Col>
        <Col sm={7}>
          <Field value={this.getPlanIncludedServices(plan)} editable={false} />
        </Col>
      </FormGroup>
    ), (
      <FormGroup key="services">
        <Col componentClass={ControlLabel} sm={3} lg={2}>Services</Col>
        <Col sm={8} lg={9}>
          { editable
            ? <Select
              multi={true}
              value={servicesList}
              options={servicesOptions}
              onChange={this.onChangeService}
              clearable={false}
            />
          : <Field value={servicesList.replace(/,/g, ', ')} editable={false} />
          }
        </Col>
      </FormGroup>
    )]);
  }

  fetchItem = () => {
    const { subscription } = this.state;
    this.props.getSubscription(subscription);
  }

  clearRevisions = () => {
    const { subscription } = this.state;
    this.props.clearRevisions(subscription);
    this.clearItemsList();
  }

  clearItemsList = () => {
    this.props.clearList();
  }

  getActions = () => [{
    type: 'back',
    label: 'Back To List',
    onClick: this.props.onCancel,
    actionStyle: 'primary',
    actionSize: 'xsmall',
  }];

  renderPanelTitle = () => {
    const { mode, subscription } = this.props;
    const title = buildPageTitle(mode, 'subscription', subscription);
    return (
      <div>
        { title }
        <div className="pull-right">
          <Actions actions={this.getActions()} />
        </div>
      </div>
    );
  }

  render() {
    const { progress, subscription } = this.state;
    const { revisions, mode, allServices, subscription: originSubscription } = this.props;
    const allowEdit = ['update', 'clone', 'closeandnew', 'create'].includes(mode);
    const services = subscription.get('services', Immutable.List()) || Immutable.List();
    const subscriptionFrom = getItemDateValue(subscription, 'from');
    const originServices = originSubscription.get('services', Immutable.List()) || Immutable.List();

    return (
      <div className="Subscription">
        <Panel header={this.renderPanelTitle()}>
          <EntityRevisionDetails
            itemName="subscription"
            revisions={revisions}
            item={subscription}
            mode={mode}
            onChangeFrom={this.onChangeFrom}
            backToList={this.props.onCancel}
            reLoadItem={this.fetchItem}
            clearRevisions={this.clearRevisions}
            onActionEdit={this.props.getSubscription}
            onActionClone={this.props.getSubscription}
            clearList={this.clearItemsList}
          />

          <hr />

          <Form horizontal>
            { this.renderSystemFields(allowEdit) }
            <SubscriptionServicesDetails
              subscriptionServices={services}
              originSubscriptionServices={originServices}
              servicesOptions={allServices}
              editable={allowEdit}
              subscriptionFrom={subscriptionFrom}
              onChangeService={this.onChangeServiceDetails}
              onRemoveService={this.onRemoveService}
              onAddService={this.onAddService}
            />
            <EntityFields
              entityName={['subscribers', 'subscriber']}
              entity={subscription}
              onChangeField={this.updateSubscriptionField}
              fieldsFilter={this.filterCustomFields}
              editable={allowEdit}
            />
          </Form>
        </Panel>

        <ActionButtons
          onClickCancel={this.props.onCancel}
          onClickSave={this.onSave}
          hideSave={!allowEdit}
          cancelLabel={allowEdit ? undefined : 'Back'}
          progress={progress}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const { subscription } = props;
  const collection = getConfig(['systemItems', 'subscription', 'collection'], '');
  const key = toImmutableList(getConfig(['systemItems', 'subscription', 'uniqueField'], ''))
    .map(revisionBy => subscription.get(revisionBy, ''))
    .join('_');
  const revisions = state.entityList.revisions.getIn([collection, key]);
  const mode = (!subscription || !getItemId(subscription, false)) ? 'create' : getItemMode(subscription);
  return ({
    revisions,
    mode,
  });
};
export default connect(mapStateToProps)(Subscription);
