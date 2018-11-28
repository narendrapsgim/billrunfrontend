import { connect } from 'react-redux';
import Immutable from 'immutable';
import EventsList from './EventsList';
import EventBalanceForm from './EventBalanceForm';
import {
  showConfirmModal,
  showFormModal,
} from '../../actions/guiStateActions/pageActions';
import {
  removeEvent,
  addEvent,
  updateEvent,
  saveEvents,
  getEvents,
} from '../../actions/eventActions';
import {
  eventsSelectorForList,
} from '../../selectors/settingsSelector';

const mapStateToProps = (state, props) => ({
  items: eventsSelectorForList(state, props),
});

const mapDispatchToProps = (dispatch, props) => ({

  onRemove: (item) => {
    const onOk = () => {
      dispatch(removeEvent(props.eventType, item));
      dispatch(saveEvents(props.eventType))
        .then(() => dispatch(getEvents(props.eventType)));
    };
    const confirm = {
      message: `Are you sure you want to delete "${item.get('event_code')}" event?`,
      onOk,
      labelOk: 'Delete',
      type: 'delete',
    };
    return dispatch(showConfirmModal(confirm));
  },

  onEdit: (item) => {
    const onOk = (editedItem) => {
      dispatch(updateEvent(props.eventType, editedItem));
      dispatch(saveEvents(props.eventType))
        .then(() => dispatch(getEvents(props.eventType)));
    };
    const config = {
      title: `Edit "${item.get('event_code')}" event`,
      onOk,
    };
    return dispatch(showFormModal(item, EventBalanceForm, config));
  },

  onClone: (item) => {
    const clone = item.delete(['ui_flags', 'id']);
    const onOk = (editedItem) => {
      dispatch(addEvent(props.eventType, editedItem));
      dispatch(saveEvents(props.eventType))
        .then(() => dispatch(getEvents(props.eventType)));
    };
    const config = {
      title: `Clone "${item.get('event_code')}" event`,
      onOk,
    };
    return dispatch(showFormModal(clone, EventBalanceForm, config));
  },

  onNew: () => {
    const onOk = (editedItem) => {
      dispatch(addEvent(props.eventType, editedItem));
      dispatch(saveEvents(props.eventType))
        .then(() => dispatch(getEvents(props.eventType)));
    };
    const config = {
      title: 'Create new event',
      onOk,
    };
    return dispatch(showFormModal(Immutable.Map(), EventBalanceForm, config));
  },

  onEnable: (item) => {
    const onOk = () => {
      const editedItem = item.set('active', true);
      dispatch(updateEvent(props.eventType, editedItem));
      dispatch(saveEvents(props.eventType))
        .then(() => dispatch(getEvents(props.eventType)));
    };
    const confirm = {
      message: `Are you sure you want to enable "${item.get('event_code')}" event?`,
      onOk,
      type: 'confirm',
      labelOk: 'Enable',
    };
    dispatch(showConfirmModal(confirm));
  },

  onDisable: (item) => {
    const onOk = () => {
      const editedItem = item.set('active', false);
      dispatch(updateEvent(props.eventType, editedItem));
      dispatch(saveEvents(props.eventType))
        .then(() => dispatch(getEvents(props.eventType)));
    };
    const confirm = {
      message: `Are you sure you want to disable "${item.get('event_code')}" event?`,
      onOk,
      type: 'delete',
      labelOk: 'Disable',
    };
    dispatch(showConfirmModal(confirm));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EventsList);
