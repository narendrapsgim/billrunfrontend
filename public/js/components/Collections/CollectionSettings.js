import React, { PropTypes, Component } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { Panel, Col, Form, FormGroup, ControlLabel } from 'react-bootstrap';
import { ActionButtons } from '../Elements';
import Field from '../Field';
import {
  getCollectionSettings,
  saveCollectionSettings,
  updateCollectionSettings,
} from '../../actions/collectionsActions';
import { collectionSettingsSelector } from '../../selectors/settingsSelector';


class CollectionSettings extends Component {

  static propTypes = {
    settings: PropTypes.instanceOf(Immutable.Map),
    dispatch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    settings: Immutable.Map(),
  };

  componentWillMount() {
    this.props.dispatch(getCollectionSettings());
  }

  onChangeMinDeb = (e) => {
    const { value } = e.target;
    this.props.dispatch(updateCollectionSettings('min_debt', value));
  }

  onSave = () => {
    this.props.dispatch(saveCollectionSettings());
  }

  render() {
    const { settings } = this.props;
    const minDebt = settings.get('min_debt', '');
    return (
      <div>
        <Col sm={12}>
          <Panel header="&nbsp;">
            <Form horizontal>
              <FormGroup>
                <Col sm={2} componentClass={ControlLabel}>
                  Minimum debt
                </Col>
                <Col sm={6}>
                  <Field value={minDebt} onChange={this.onChangeMinDeb} fieldType="number" />
                </Col>
              </FormGroup>
            </Form>
          </Panel>
        </Col>
        <Col sm={12}>
          <ActionButtons onClickSave={this.onSave} hideCancel={true} />
        </Col>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  settings: collectionSettingsSelector(state, props),
});

export default connect(mapStateToProps)(CollectionSettings);
