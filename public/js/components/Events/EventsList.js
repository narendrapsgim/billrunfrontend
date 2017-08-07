import React, { PropTypes, Component } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { Panel, Col, Form, Button } from 'react-bootstrap';
import { ActionButtons, ModalWrapper } from '../Elements';
import { getSettings, updateSetting, saveSettings } from '../../actions/settingsActions';
import { eventsSelector } from '../../selectors/settingsSelector';
import EventForm from './EventForm';
import List from '../../components/List';
import { getConfig } from '../../common/Util';

class EventSettings extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    events: PropTypes.instanceOf(Immutable.Map),
  };

  static defaultProps = {
    events: Immutable.Map(),
  };

  state = {
    event: Immutable.Map(),
    editedEvent: null,
  };

  componentWillMount() {
    this.props.dispatch(getSettings(['events']));
  }

  onSave = () => {
    this.props.dispatch(saveSettings(['events']));
  }

  onClickNewEvent = entityType => () => {
    const { events } = this.props;
    this.setState({
      editedEvent: Immutable.Map({
        item: Immutable.Map(),
        index: events.get(entityType, Immutable.List()).size,
        entityType,
      }),
    });
  }

  getEventIndex = (entityType, event) => {
    const { events } = this.props;
    return events.get(entityType, Immutable.List()).findIndex(e => e.get('event_code', '') === event.get('event_code'));
  }

  onClickEditEvent = entityType => (item) => {
    this.setState({
      editedEvent: Immutable.Map({
        item,
        index: this.getEventIndex(entityType, item),
        entityType,
      }),
    });
  }

  onSaveEvent = () => {
    const { editedEvent } = this.state;
    this.setState({ editedEvent: null });
    this.props.dispatch(updateSetting('events', [editedEvent.get('entityType'), editedEvent.get('index')], editedEvent.get('item')));
  }

  onCancelEventForm = () => {
    this.setState({ editedEvent: null });
  }

  onUpdateEventField = (fieldPath, value) => {
    const { editedEvent } = this.state;
    this.setState({ editedEvent: editedEvent.setIn(['item', ...fieldPath], value) });
  }

  getConditionName = conditionKey => (
    (getConfig('events', Immutable.Map).get('conditions', Immutable.List()).find(condition => condition.get('key', '') === conditionKey) || Immutable.Map).get('title', '')
  )

  getConditionPath = conditionPath => (
    conditionPath
  );

  getConditionDescription = condition =>
    `${this.getConditionPath(condition.get('path', ''))} ${this.getConditionName(condition.get('type', ''))} ${condition.get('value', '')}`;

  onShowConditionsList = event => () => {
    this.setState({ event });
  }

  onHideConditionsList = () => {
    this.setState({ event: Immutable.Map() });
  }

  conditionsParser = event => (
    <Button bsStyle="link" onClick={this.onShowConditionsList(event)} style={{ verticalAlign: 'bottom' }}>conditions</Button>
  );

  getListFields = () => [
    { id: 'event_code', title: 'Event Code' },
    { id: 'conditions', title: 'Conditions', parser: this.conditionsParser },
  ]

  getListActions = entityType => [
    { type: 'edit', showIcon: true, helpText: 'Edit', onClick: this.onClickEditEvent(entityType) },
  ]

  renderPanelHeader = eventEntity => (
    <div>
      {eventEntity.get('title', '')}
      <div className="pull-right">
        <Button bsSize="xsmall" className="btn-primary" onClick={this.onClickNewEvent(eventEntity.get('key', ''))}>
          <i className="fa fa-plus" />&nbsp;Add New
        </Button>
      </div>
    </div>
  );

  renderEntityEvents = (entity) => {
    const { events } = this.props;
    const fields = this.getListFields();
    const actions = this.getListActions(entity);
    return (
      <List items={events.get(entity, Immutable.List())} fields={fields} actions={actions} />
    );
  }

  renderEvents = () => {
    const eventEntities = getConfig('events', Immutable.Map()).get('entities', Immutable.Map());
    return eventEntities.map(eventEntity => (
      <Panel header={this.renderPanelHeader(eventEntity)} key={eventEntity.get('key', '')}>
        <Form horizontal>
          {this.renderEntityEvents(eventEntity.get('key', ''))}
        </Form>
      </Panel>
    )).toList();
  }

  renderConditionsListPopup = () => {
    const { event } = this.state;
    const title = `Conditions for event ${event.get('event_code', '')}`;
    return (
      <ModalWrapper title={title} show={!event.isEmpty()} onCancel={this.onHideConditionsList} onHide={this.onHideConditionsList} labelCancel="OK">
        <div>
          {event.get('conditions', Immutable.List()).map((condition, index) => (
            <span key={`condition-${index}`}>
              {this.getConditionDescription(condition)}
              <br />
            </span>
          ))}
        </div>
      </ModalWrapper>
    );
  }

  renderEventForm = () => {
    const { editedEvent } = this.state;
    return editedEvent !== null &&
      (<EventForm
        item={editedEvent.get('item', Immutable.Map())}
        onUpdateField={this.onUpdateEventField}
        onSave={this.onSaveEvent}
        onCancel={this.onCancelEventForm}
      />);
  }

  renderSaveButton = () => (<ActionButtons onClickSave={this.onSave} hideCancel={true} />);

  render() {
    return (
      <div>
        <Col sm={12}>
          { this.renderEvents() }
          { this.renderConditionsListPopup() }
          { this.renderEventForm() }
        </Col>
        <Col sm={12}>
          { this.renderSaveButton() }
        </Col>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  events: eventsSelector(state, props),
});

export default connect(mapStateToProps)(EventSettings);
