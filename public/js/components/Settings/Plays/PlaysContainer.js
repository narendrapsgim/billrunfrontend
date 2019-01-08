import { connect } from 'react-redux';
import Immutable from 'immutable';
import Plays from './Plays';
import PlayForm from './PlayFormContainer';
import { showFormModal } from '../../../actions/guiStateActions/pageActions';
import { saveSettings, getSettings } from '../../../actions/settingsActions';

const mapStateToProps = null; // eslint-disable-line no-unused-vars

const mapDispatchToProps = (dispatch, props) => ({

  onAddPlay: () => {
    const { data } = props;
    const newPlay = Immutable.Map({
      name: '',
      label: '',
      enabled: true,
      default: data.isEmpty(),
    });
    const onOk = (newItem) => {
      if (newItem.get('default', false)) {
        data.forEach((p, index) => {
          props.onChange('plays', [index, 'default'], false);
        });
      }
      props.onChange('plays', data.size, newItem);
      return dispatch(saveSettings(['plays']))
        .then(success => (success.status ? true : Promise.reject()))
        .then(() => dispatch(getSettings('plays')))
        .catch(() => {
          dispatch(getSettings('plays'));
          return Promise.reject();
        });
    };
    const config = {
      title: 'Create New Paly',
      onOk,
      mode: 'create',
      existingNames: data.map(play => play.get('name', '')),
    };
    return dispatch(showFormModal(newPlay, PlayForm, config));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Plays);
