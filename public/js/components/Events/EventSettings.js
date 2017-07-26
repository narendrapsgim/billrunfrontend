import React, { PropTypes, Component } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { Panel, Col, Row, Form, FormGroup, ControlLabel } from 'react-bootstrap';
import Select from 'react-select';
import { updateSetting } from '../../actions/settingsActions';
import { eventsSettingsSelector } from '../../selectors/settingsSelector';
import Field from '../Field';
import Help from '../Help';

class EventSettings extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    eventsSettings: PropTypes.instanceOf(Immutable.Map),
  };

  static defaultProps = {
    eventsSettings: Immutable.Map(),
  };

  state = {
    currentItem: null,
    index: -1,
  }

  onChange = eventNotifier => (e) => {
    const { value, id } = e.target;
    this.props.dispatch(updateSetting('events', ['settings', eventNotifier, id], value));
  }

  onChangeSelect = (eventNotifier, id) => (value) => {
    this.props.dispatch(updateSetting('events', ['settings', eventNotifier, id], value));
  }

  methodOptions = [{ value: 'post', label: 'POST' }, { value: 'get', label: 'GET' }];
  decoderOptions = [{ value: 'json', label: 'JSON' }, { value: 'xml', label: 'XML' }];
  fields = Immutable.List([
    Immutable.Map({ field_name: 'url', title: 'Url', info: 'URL to send the requests to' }),
    Immutable.Map({ field_name: 'num_of_tries', title: 'Number of retries', type: 'number', info: 'Number of times to try and send each event' }),
    Immutable.Map({ field_name: 'method', title: 'Method', info: 'HTTP method', options: this.methodOptions }),
    Immutable.Map({ field_name: 'decoder', title: 'Decoder', info: 'Method to decode HTTP response', options: this.decoderOptions }),
  ]);

  renderEventSettingFields = (eventSettings, eventNotifier) => (
    this.fields.map((field) => {
      const fieldName = field.get('field_name', '');
      const fieldInfo = field.get('info', '');
      const fieldOptions = field.get('options', []);
      return (
        <FormGroup key={fieldName}>
          <Col sm={2} componentClass={ControlLabel}>
            {field.get('title', fieldName)}
            {fieldInfo !== '' && (<Help contents={fieldInfo} />)}
          </Col>
          <Col sm={6}>
            {
              fieldOptions.length
              ? (<Select
                id={fieldName}
                value={eventSettings.get(fieldName, '')}
                onChange={this.onChangeSelect(eventNotifier, fieldName)}
                options={fieldOptions}
              />)
              : (<Field
                id={fieldName}
                value={eventSettings.get(fieldName, '')}
                onChange={this.onChange(eventNotifier)}
                fieldType={field.get('type', 'text')}
              />)
            }
          </Col>
        </FormGroup>
      );
    })
  );

  renderSettings = () => {
    const { eventsSettings } = this.props;
    return eventsSettings.map((eventSettings, eventNotifier) => (
      <Panel header={eventNotifier} key={eventNotifier}>
        <Form horizontal>
          {this.renderEventSettingFields(eventSettings, eventNotifier)}
        </Form>
      </Panel>
    )).toList();
  }

  render() {
    return (
      <div>
        <Row>
          <Col sm={12}>
            { this.renderSettings() }
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  eventsSettings: eventsSettingsSelector(state, props),
});

export default connect(mapStateToProps)(EventSettings);
