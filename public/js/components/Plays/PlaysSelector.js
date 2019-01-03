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
    onChange: PropTypes.func,
  }

  static defaultProps = {
    availablePlays: Immutable.List(),
    editable: true,
    multi: false,
    onChange: () => {},
  }

  componentWillMount() {
    this.props.dispatch(getSettings(['plays']));
  }

  render() {
    const { availablePlays, entity, editable, multi, onChange } = this.props;
    if (!shouldUsePlays(availablePlays)) {
      return null;
    }
    const play = entity.get('play', '');
    const label = multi ? 'Play/s' : 'Play';
    const displayValue = typeof play.join === 'function' ? play.join(',') : play;
    return (
      <FormGroup key="play">
        <Col componentClass={ControlLabel}sm={3} lg={2}>{label}</Col>
        <Col sm={8} lg={9}>
          { editable
            ? <Select
              options={getPlayOptions(availablePlays)}
              value={play}
              onChange={onChange}
              multi={multi}
            />
          : <Field value={displayValue} editable={false} />
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
