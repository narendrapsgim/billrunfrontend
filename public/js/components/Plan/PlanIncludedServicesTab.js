import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Panel, Form, Col, Row } from 'react-bootstrap';
import { List } from 'immutable';
import Select from 'react-select';
import { PlanDescription } from '../../FieldDescriptions';
import Help from '../Help';
import { getServicesKeysQuery } from '../../common/ApiQueries';
import { getList } from '../../actions/listActions';


class PlanIncludedServicesTab extends Component {

  static propTypes = {
    includedServices: PropTypes.instanceOf(List),
    mode: PropTypes.string,
    services: PropTypes.instanceOf(List),
    dispatch: PropTypes.func.isRequired,
    onChangeFieldValue: PropTypes.func.isRequired,
  };

  static defaultProps = {
    includedServices: List(),
    mode: 'create',
    services: List(),
  };

  componentWillMount() {
    this.props.dispatch(getList('services_keys', getServicesKeysQuery()));
  }

  onChangeServices = (services) => {
    const servicesList = (services.length) ? services.split(',') : [];
    this.props.onChangeFieldValue(['include', 'services'], List(servicesList));
  }

  getServicesOptions = () => {
    const { services } = this.props;
    return services
      .map(service => ({
        value: service.get('name', ''),
        label: service.get('name', ''),
      })).toArray();
  }

  renderEditableServices = () => {
    const { includedServices } = this.props;
    const panelTitle = (
      <h3>Select included services <Help contents={PlanDescription.included_services} /></h3>
    );

    return (
      <Panel header={panelTitle}>
        <Select
          multi
          value={includedServices.toArray()}
          onChange={this.onChangeServices}
          options={this.getServicesOptions()}
        />
      </Panel>
    );
  }

  renderNonEditableServices = () => {
    const { includedServices } = this.props;
    const panelTitle = (
      <h3>Services <Help contents={PlanDescription.included_services} /></h3>
    );

    return (
      <Panel header={panelTitle}>
        <div>
          {includedServices.size ? includedServices.join(', ') : 'No included services'}
        </div>
      </Panel>
    );
  }

  renderServices = () => {
    const { mode } = this.props;
    const editable = (mode !== 'view');
    return editable ? this.renderEditableServices() : this.renderNonEditableServices();
  }

  render() {
    return (
      <Row>
        <Col lg={12}>
          <Form>
            {this.renderServices()}
          </Form>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  services: state.list.get('services_keys'),
});
export default connect(mapStateToProps)(PlanIncludedServicesTab);
