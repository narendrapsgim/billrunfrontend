import React, { PropTypes, Component } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { Panel, Col, Form, Button } from 'react-bootstrap';
import { ActionButtons } from '../Elements';
import { getSettings, saveSettings, removeSettingField } from '../../actions/settingsActions';
import { saveEvent } from '../../actions/eventActions';
import { eventsSelector } from '../../selectors/settingsSelector';
import EventForm from './EventForm';
import List from '../../components/List';
import { getConfig } from '../../common/Util';
import { showConfirmModal } from '../../actions/guiStateActions/pageActions';

class EventSettings extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    events: PropTypes.instanceOf(Immutable.Map),
  };

  static defaultProps = {
    events: Immutable.Map(),
  };

  state = {
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

  onDeleteOk = (entityType, index) => {
    this.props.dispatch(removeSettingField('events', [entityType, index]));
  }

  renderConfirmModal = entityType => (event) => {
    const onDelete = () => {
      this.onDeleteOk(entityType, this.getEventIndex(entityType, event));
    };
    const confirm = {
      message: 'Are you sure you want to delete this event?',
      onOk: onDelete,
      labelOk: 'Delete',
      type: 'delete',
    };
    this.props.dispatch(showConfirmModal(confirm));
  }

  onSaveEvent = () => {
    const { editedEvent } = this.state;
    this.setState({ editedEvent: null });
    this.props.dispatch(saveEvent(editedEvent.get('entityType'), editedEvent.get('index'), editedEvent.get('item')));
  }

  onCancelEventForm = () => {
    this.setState({ editedEvent: null });
  }

  onUpdateEventField = (fieldPath, value) => {
    const { editedEvent } = this.state;
    this.setState({ editedEvent: editedEvent.setIn(['item', ...fieldPath], value) });
  }

  getListFields = () => [
    { id: 'event_code', title: 'Event Code' },
  ]

  getListActions = entityType => [
    { type: 'edit', showIcon: true, helpText: 'Edit', onClick: this.onClickEditEvent(entityType) },
    { type: 'remove', showIcon: true, helpText: 'Remove', onClick: this.renderConfirmModal(entityType) },
  ];

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
