import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { Panel, Col, Form, FormGroup, ControlLabel } from 'react-bootstrap';
import Select from 'react-select';
import { ActionButtons } from '../Elements';
import Field from '../Field';
import Help from '../Help';


const EventSettings = ({ eventsSettings, methodOptions, decoderOptions, ...props }) => {
  const onChange = eventNotifier => (e) => {
    const { value, id } = e.target;
    props.onEdit(eventNotifier, id, value);
  };

  const onChangeSelect = (eventNotifier, id) => (value) => {
    props.onEdit(eventNotifier, id, value);
  };

  return (
    <Form horizontal>
      <Col sm={12}>
        <Panel header="HTTP" key="http">
          <FormGroup>
            <Col sm={2} componentClass={ControlLabel}>
              Url <Help contents="URL to send the requests to" />
            </Col>
            <Col sm={6}>
              <Field id="url" value={eventsSettings.getIn(['http', 'url'], '')} onChange={onChange('http')} />
            </Col>
          </FormGroup>
          <FormGroup >
            <Col sm={2} componentClass={ControlLabel}>
              Method <Help contents="HTTP method" />
            </Col>
            <Col sm={6}>
              <Select
                id="method"
                value={eventsSettings.getIn(['http', 'method'], '')}
                onChange={onChangeSelect('http', 'method')}
                options={methodOptions}
              />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col sm={2} componentClass={ControlLabel}>
              Decoder <Help contents="Method to decode HTTP response" />
            </Col>
            <Col sm={6}>
              <Select
                id="decoder"
                value={eventsSettings.getIn(['http', 'decoder'], '')}
                onChange={onChangeSelect('http', 'decoder')}
                options={decoderOptions}
              />
            </Col>
          </FormGroup>
        </Panel>
      </Col>
      <Col sm={12}>
        <ActionButtons onClickSave={props.onSave} onClickCancel={props.onCancel} />
      </Col>
    </Form>
  );
};

EventSettings.propTypes = {
  eventsSettings: PropTypes.instanceOf(Immutable.Map),
  methodOptions: PropTypes.array,
  decoderOptions: PropTypes.array,
  onSave: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

EventSettings.defaultProps = {
  eventsSettings: Immutable.Map(),
  methodOptions: [{ value: 'post', label: 'POST' }, { value: 'get', label: 'GET' }],
  decoderOptions: [{ value: 'json', label: 'JSON' }, { value: 'xml', label: 'XML' }],
};

export default EventSettings;
