import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { Form, FormGroup, ControlLabel, Col, Button, Panel, InputGroup } from 'react-bootstrap';
import Select from 'react-select';
import moment from 'moment';
import { titleCase } from 'change-case';
import ActionButtons from '../Elements/ActionButtons';
import Actions from '../Elements/Actions';
import Field from '../Field';
import Credit from '../Credit/Credit';
import { EntityRevisionDetails } from '../Entity';
import EntityFields from '../Entity/EntityFields';
import {
  getConfig,
  getItemId,
  getFieldName,
  getItemMode,
  getItemDateValue,
  buildPageTitle,
} from '../../common/Util';


class Subscription extends Component {

  static propTypes = {
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
      showCreditCharge: false,
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
    this.props.onSave(subscription, mode);
  }

  onChangeFrom = (path, value) => {
    const { subscription } = this.state;
    // update FROM field to added services
    const services = subscription.get('services', Immutable.List()) || Immutable.List();
    const servicesList = services.map(service => service.get('name', '')).toArray();
    const to = getItemDateValue(subscription, 'to', moment().add(100, 'years')).toISOString();
    const from = moment(value).toISOString();
    const newServices = this.updateServicesDates(servicesList, from, to);
    const newSubscription = subscription.withMutations(subscriptionWithMutations =>
      subscriptionWithMutations
        .setIn(path, value)
        .set('services', newServices)
    );
    this.setState({ subscription: newSubscription });
  }

  onChangePlan = (plan) => {
    this.updateSubscriptionField(['plan'], plan);
  }

  onChangeServiceQuantity = (serviceName, e) => {
    const { value } = e.target;
    const { subscription } = this.state;
    const services = subscription.get('services', Immutable.List()) || Immutable.List();
    const serviceIndex = services.findIndex(service => service.get('name', '') === serviceName);
    if (serviceIndex > -1) {
      const fixedValue = value > 1 ? value : 1; // not possible to add 0 for quantity service
      const newService = services.get(serviceIndex, Immutable.Map())
        .withMutations((servicesWithMutations) => {
          servicesWithMutations
            .set('quantity', fixedValue)
            .set('from', getItemDateValue(subscription, 'from').toISOString());
        });
      this.updateSubscriptionField(['services', serviceIndex], newService);
    }
  }

  onChangeService = (services) => {
    const { subscription } = this.state;
    const servicesList = (services.length) ? services.split(',') : [];
    const from = getItemDateValue(subscription, 'from').format('YYYY-MM-DD');
    const to = getItemDateValue(subscription, 'to', moment().add(100, 'years')).toISOString();
    const newServices = this.updateServicesDates(servicesList, from, to);
    this.updateSubscriptionField(['services'], newServices);
  }

  updateServicesDates = (servicesNames, from, to) => {
    const { subscription, allServices } = this.props;
    const { subscription: currentSubscription } = this.state;
    const originServices = subscription.get('services', Immutable.List()) || Immutable.List();
    return Immutable.List().withMutations((servicesWithMutations) => {
      if (servicesNames.length) {
        servicesNames.forEach((name) => {
          // get existting or create new
          let service = originServices.find(
            originService => originService.get('name') === name,
            null,
            Immutable.Map({ name, from, to })
          );
          // if service type quantitative,
          // for new -> set default quantity.
          // for existing -> set existing quantity.
          const serviceOption = allServices.find(option => option.get('name', '') === name);
          if (serviceOption.get('quantitative', false) === true) {
            const currentServices = currentSubscription.get('services', Immutable.List()) || Immutable.List();
            const quantity = currentServices.find(
              currentService => currentService.get('name') === name,
              null,
              Immutable.Map()
            ).get('quantity', 1);
            service = service.set('quantity', quantity);
          }
          // if service is by 'custom_period' -> don't reset the 'from' date to Subscriber 'from' date
          if (serviceOption.get('balance_period', 'default') !== 'default') {
            const currentServices = currentSubscription.get('services', Immutable.List()) || Immutable.List();
            const originFrom = currentServices.find(
              currentService => currentService.get('name') === name,
              null,
              Immutable.Map(),
            ).get('from', from);
            service = service.set('from', originFrom);
          }
          servicesWithMutations.push(service);
        });
      }
    });
  }

  onShowCreditCharge = () => {
    this.setState({ showCreditCharge: true });
  }

  onCloseCreditCharge = () => {
    this.setState({ showCreditCharge: false });
  }

  updateSubscriptionField = (path, value) => {
    const { subscription } = this.state;
    const newSubscription = subscription.setIn(path, value);
    this.setState({ subscription: newSubscription });
  }

  formatSelectOptions = items => items.map(item => ({
    value: item.get('name', ''),
    label: item.get('description', item.get('name', '')),
  }));

  getAvailablePlans = () => this.formatSelectOptions(this.props.allPlans);

  getAvailableServices = () => this.formatSelectOptions(this.props.allServices);

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

  renderSystemFields = (editable) => {
    const { subscription } = this.state;
    const plansOptions = this.getAvailablePlans().toJS();
    const servicesOptions = this.getAvailableServices().toJS();
    const services = subscription.get('services', Immutable.List()) || Immutable.List();
    const servicesList = services.map(service => service.get('name', '')).join(',');
    const plan = subscription.get('plan', '');
    return ([(
      <FormGroup key="plan">
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
      <FormGroup key="services">
        <Col componentClass={ControlLabel} sm={3} lg={2}>Services</Col>
        <Col sm={8} lg={9}>
          { editable
            ? <Select
              multi={true}
              value={servicesList}
              options={servicesOptions}
              onChange={this.onChangeService}
            />
            : <Field value={servicesList} editable={false} />
          }
        </Col>
      </FormGroup>
    )]);
  }

  renderServicesQuentity = (editable) => {
    const { subscription } = this.state;
    const { allServices } = this.props;
    const services = subscription.get('services', Immutable.List()) || Immutable.List();
    return services
      .filter(service => service.get('quantity', null) !== null)
      .map((service, key) => {
        const serviceName = allServices.find(
          allService => allService.get('name', '') === service.get('name', ''),
          null,
          Immutable.Map(),
        ).get('description', service.get('name', ''));
        const serviceKey = service.get('name', '');
        const onChangeBind = (e) => { this.onChangeServiceQuantity(serviceKey, e); };
        return (
          <FormGroup key={`quentity_${key}`}>
            <Col componentClass={ControlLabel} sm={3} lg={2}>
              {serviceName}
            </Col>
            <Col sm={8} lg={9}>
              <InputGroup>
                <Field fieldType="number" min={1} value={service.get('quantity', '')} onChange={onChangeBind} editable={editable} />
                <InputGroup.Addon>quantity</InputGroup.Addon>
              </InputGroup>
            </Col>
          </FormGroup>
        );
      })
      .toArray();
  }

  onChangePeriodStartDate = (name, newDate) => {
    const { subscription } = this.state;
    const services = subscription.get('services', Immutable.List()) || Immutable.List();
    const serviceIndex = services.findIndex(service => service.get('name', '') === name);
    if (serviceIndex !== -1) {
      this.updateSubscriptionField(['services', serviceIndex, 'from'], newDate.toISOString());
    }
  }

  renderServicesByPeriod = (editable) => {
    const { subscription } = this.state;
    const { allServices } = this.props;
    const services = subscription.get('services', Immutable.List()) || Immutable.List();
    return services
      .map((service) => {
        const serviceBalancePeriod = allServices.find(
          allService => allService.get('name', '') === service.get('name', ''),
          null,
          Immutable.Map(),
        ).get('balance_period', 'default');
        return service.set('balance_period', serviceBalancePeriod);
      })
      .filter(service => service.get('balance_period', 'default') !== 'default')
      .map((service, key) => {
        const serviceName = allServices.find(
          allService => allService.get('name', '') === service.get('name', ''),
          null,
          Immutable.Map(),
        ).get('description', service.get('name', ''));
        const serviceKey = service.get('name', '');
        const onChangeBind = (e) => { this.onChangePeriodStartDate(serviceKey, e); };
        return (
          <FormGroup key={`byPeriod_${key}`}>
            <Col componentClass={ControlLabel} sm={3} lg={2}>
              {serviceName}
            </Col>
            <Col sm={8} lg={9}>
              <InputGroup>
                <InputGroup.Addon>Start Date</InputGroup.Addon>
                <Field fieldType="date" min={1} value={moment(service.get('from', ''))} onChange={onChangeBind} editable={editable} />
              </InputGroup>
            </Col>
          </FormGroup>
        );
      })
      .toArray();
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
    const { revisions, mode } = this.props;
    const allowAddCredit = ['update', 'view', 'closeandnew'].includes(mode);
    const allowEdit = ['update', 'clone', 'closeandnew', 'create'].includes(mode);
    const servicesQuentity = this.renderServicesQuentity(allowEdit);
    const servicesByPeriod = this.renderServicesByPeriod(allowEdit);
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
            { (servicesQuentity.length + servicesByPeriod.length > 0) ? (
              <Panel header="Services Details">
                {servicesQuentity}
                {servicesQuentity.length > 0 && servicesByPeriod.length > 0 && <hr />}
                {servicesByPeriod}
              </Panel>
              ) : (<hr />)
            }
            <EntityFields
              entityName={['subscribers', 'subscriber']}
              entity={subscription}
              onChangeField={this.updateSubscriptionField}
              fieldsFilter={this.filterCustomFields}
              editable={allowEdit}
            />
            { allowAddCredit && <hr /> }
            { allowAddCredit && this.renderCreditCharge() }
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
  const revisionBy = getConfig(['systemItems', 'subscription', 'uniqueField'], '');
  const collection = getConfig(['systemItems', 'subscription', 'collection'], '');
  const key = subscription.get(revisionBy, '');
  const revisions = state.entityList.revisions.getIn([collection, key]);
  const mode = (!subscription || !getItemId(subscription, false)) ? 'create' : getItemMode(subscription);
  return ({
    revisions,
    mode,
  });
};
export default connect(mapStateToProps)(Subscription);
