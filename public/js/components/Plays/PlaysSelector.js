import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { FormGroup, ControlLabel, Col } from 'react-bootstrap';
import Select from 'react-select';
import Field from '../Field';
import { getSettings } from '../../actions/settingsActions';
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

  render() {
    const { availablePlays, entity, editable, multi, mandatory, onChange } = this.props;
    if (!shouldUsePlays(availablePlays)) {
      return null;
    }
    const play = entity.get('play', '');
    const label = multi ? 'Play/s' : 'Play';
    const playValue = typeof play.join === 'function' ? play.join(',') : play;
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
              onChange={onChange}
              multi={multi}
              placeholder="Neutral"
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
