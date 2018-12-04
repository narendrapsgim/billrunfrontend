import { connect } from 'react-redux';
import Immutable from 'immutable';
import EventsList from './EventsList';
import BalanceEvent from './Elements/BalanceEvent';
import FraudEvent from './Elements/FraudEvent';
import {
  showConfirmModal,
  showFormModal,
} from '../../actions/guiStateActions/pageActions';
import {
  removeEvent,
  updateEvent,
  saveEvents,
  saveEvent,
  getEvents,
} from '../../actions/eventActions';
import {
  showSuccess,
} from '../../actions/alertsActions';
import {
  eventsSelector,
} from '../../selectors/settingsSelector';
import {
  getConfig,
} from '../../common/Util';


const Components = {
  balance: BalanceEvent,
  fraud: FraudEvent,
};


const defaultNewEvent = {
  balance: Immutable.Map(),
  fraud: Immutable.Map({
    date_range: Immutable.Map({ type: 'hourly' }),
    recurrence: Immutable.Map({ type: 'hourly' }),
    lines_overlap: true,
  }),

};


const mapStateToProps = (state, props) => ({
  items: eventsSelector(state, props),
});

const mapDispatchToProps = (dispatch, props) => ({

  onRemove: (item) => {
    const onOk = () => {
      dispatch(removeEvent(props.eventType, item));
      return dispatch(saveEvents(props.eventType))
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
      return dispatch(saveEvents(props.eventType))
        .then(success => (success.status ? true : Promise.reject()))
        .then(() => dispatch(getEvents(props.eventType)))
        .catch(() => {
          dispatch(getEvents(props.eventType));
          return Promise.reject();
        });
    };
    const config = {
      title: `Edit "${item.get('event_code')}" event`,
      onOk,
      mode: 'edit',
    };
    return dispatch(showFormModal(item, Components[props.eventType], config));
  },

  onClone: (item) => {
    const clone = item.deleteIn(['ui_flags', 'id']);
    const onOk = editedItem => dispatch(saveEvent(props.eventType, editedItem))
      .then(success => (success.status ? true : Promise.reject()))
      .then(() => dispatch(showSuccess(`New event ${editedItem.get('event_code', '')} saved successfuly`)))
      .then(() => dispatch(getEvents(props.eventType)))
      .catch(() => Promise.reject());
    const config = {
      title: `Clone "${item.get('event_code')}" event`,
      onOk,
      mode: 'clone',
    };
    return dispatch(showFormModal(clone, Components[props.eventType], config));
  },

  onNew: () => {
    const eventType = getConfig(['events', 'entities', props.eventType, 'title'], props.eventType);
    const onOk = editedItem => dispatch(saveEvent(props.eventType, editedItem))
      .then(success => (success.status ? true : Promise.reject()))
      .then(() => dispatch(showSuccess(`New event ${editedItem.get('event_code', '')} saved successfuly`)))
      .then(() => dispatch(getEvents(props.eventType)))
      .catch(() => Promise.reject());
    const config = {
      title: `Create new ${eventType} event`,
      onOk,
      mode: 'create',
    };
    const item = defaultNewEvent[props.eventType];
    return dispatch(showFormModal(item, Components[props.eventType], config));
  },

  onEnable: (item) => {
    const onOk = () => {
      const editedItem = item.set('active', true);
      dispatch(updateEvent(props.eventType, editedItem));
      return dispatch(saveEvents(props.eventType))
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
      return dispatch(saveEvents(props.eventType))
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
