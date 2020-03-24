import { connect } from 'react-redux';
import Plugin from './Plugin';
import PluginForm from './PluginFormContainer';
import {
  showConfirmModal,
  showFormModal,
} from '@/actions/guiStateActions/pageActions';
import { saveSettings, getSettings } from '@/actions/settingsActions';

const mapStateToProps = (state, props) => ({
  showEnableAction: !props.plugin.get('enabled', true),
});

const mapDispatchToProps = (dispatch, { index, plugin, plugins, onChange, onRemove, ...otherProps }) => ({ // eslint-disable-line no-unused-vars

  onEdit: (item) => {
    const onOk = (editedItem) => {
      onChange([index], editedItem);
      return dispatch(saveSettings(['plugins']))
        .then(success => (success.status ? true : Promise.reject()))
        .then(() => dispatch(getSettings('plugins')))
        .catch(() => {
          dispatch(getSettings('plugins'));
          return Promise.reject();
        });
    };
    const config = {
      title: `Edit Plugin ${item.get('label', '')}`,
      onOk,
      mode: 'edit',
    };
    return dispatch(showFormModal(item, PluginForm, config));
  },


  onEnable: () => {
    onChange([index, 'enabled'], true);
    return dispatch(saveSettings('plugins'))
      .then(() => dispatch(getSettings('plugins')));
  },

  onDisable: (item) => {
    const onOk = () => {
      onChange([index, 'enabled'], false);
      return dispatch(saveSettings(['plugins']))
        .then(() => dispatch(getSettings('plugins')));
    };
    const confirm = {
      message: `Are you sure you want to disable plugin "${item.get('label', '')}"?`,
      onOk,
      type: 'delete',
      labelOk: 'Disable',
    };
    return dispatch(showConfirmModal(confirm));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Plugin);
