import { connect } from 'react-redux';
import {
  getEventSettings,
  saveEventSettings,
  updateEventSettings,
} from '../../actions/eventActions';
import { eventsSettingsSelector } from '../../selectors/settingsSelector';
import EventSettings from './EventSettings';


const mapStateToProps = (state, props) => ({
  eventsSettings: eventsSettingsSelector(state, props),
});

const mapDispatchToProps = dispatch => ({
  onCancel: () => {
    dispatch(getEventSettings());
  },
  onEdit: (eventNotifier, field, value) => {
    dispatch(updateEventSettings([eventNotifier, field], value));
  },
  onSave: () => {
    dispatch(saveEventSettings());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EventSettings);
