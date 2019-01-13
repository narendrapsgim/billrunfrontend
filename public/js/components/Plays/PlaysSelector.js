import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { FormGroup, ControlLabel, Col } from 'react-bootstrap';
import Select from 'react-select';
import Field from '../Field';
import { getSettings } from '../../actions/settingsActions';
import { showConfirmModal } from '../../actions/guiStateActions/pageActions';
import {
  availablePlaysSettingsSelector,
} from '../../selectors/settingsSelector';
import {
  shouldUsePlays,
  getPlayOptions,
} from '../../common/Util';


class PlaysSelector extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    availablePlays: PropTypes.instanceOf(Immutable.List),
    entity: PropTypes.instanceOf(Immutable.Map).isRequired,
    editable: PropTypes.bool,
    multi: PropTypes.bool,
    mandatory: PropTypes.bool,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    availablePlays: Immutable.List(),
    editable: true,
    multi: false,
    mandatory: false,
    onChange: () => {},
  }

  componentWillMount() {
    this.props.dispatch(getSettings(['plays']));
  }

  componentWillReceiveProps(nextProps) {
    const { availablePlays, mandatory, editable, onChange, entity } = this.props;
    // Set default play in edit mode if it required and not set.
    const playsLoadedComplete = !nextProps.availablePlays.isEmpty() && Immutable.is(availablePlays, nextProps.availablePlays);
    const playNotSet = entity.get('play', null) === null;
    if (playNotSet && mandatory && editable && playsLoadedComplete) {
      const defaultPlay = nextProps.availablePlays.find(
        availablePlay => availablePlay.get('enabled', true) && availablePlay.get('default', false),
        null, nextProps.availablePlays.first(),
      ).get('name', '');
      onChange(defaultPlay);
    }
  }

  playsValueToList = (plays) => {
    if (plays === '') {
      return Immutable.List();
    }
    if (Immutable.List.isList(plays)) {
      return plays;
    }
    if (Array.isArray(plays)) {
      return Immutable.List([...plays]);
    }
    return Immutable.List(plays.split(','));
  }

  onChange = (plays) => {
    const { entity } = this.props;
    const oldPlays = this.playsValueToList(entity.get('play', ''));
    const newPlays = this.playsValueToList(plays);
    // its ok to add play, only on remove play we need to remove all related data
    const isNewPlayAdded = oldPlays.every(oldPlay => newPlays.includes(oldPlay));
    if (isNewPlayAdded) {
      return this.props.onChange(newPlays.join(','));
    }
    const onCancel = () => {
      this.props.onChange(oldPlays.join(','));
      this.forceUpdate();
    };
    const onOk = () => {
      this.props.onChange(plays);
    };
    const confirm = {
      message: 'Changing play value will remove all play related data',
      children: 'Are you sure you want to change play?',
      onOk,
      onCancel,
      type: 'delete',
      labelOk: 'Change',
    };
    return this.props.dispatch(showConfirmModal(confirm));
  }

  render() {
    const { availablePlays, entity, editable, multi, mandatory } = this.props;
    if (!shouldUsePlays(availablePlays)) {
      return null;
    }
    const label = multi ? 'Play/s' : 'Play';
    const playValue = this.playsValueToList(entity.get('play', '')).join(',');
    return (
      <FormGroup key="play">
        <Col componentClass={ControlLabel}sm={3} lg={2}>
          {label}
          { mandatory && (<span className="danger-red"> *</span>)}
        </Col>
        <Col sm={8} lg={9}>
          { editable
            ? <Select
              options={getPlayOptions(availablePlays)}
              value={playValue}
              onChange={this.onChange}
              multi={multi}
              placeholder=""
              clearable={!mandatory}
            />
          : <Field value={playValue} editable={false} />
          }
        </Col>
      </FormGroup>
    );
  }
}

const mapStateToProps = (state, props) => ({
  availablePlays: availablePlaysSettingsSelector(state, props),
});
export default connect(mapStateToProps)(PlaysSelector);
