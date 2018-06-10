import React, { Component } from 'react';
import { Panel, Tabs, Tab } from 'react-bootstrap';
import Modal from 'react-bootstrap/lib/Modal';

export default class GatewayParamsModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gateway: {
        params: {},
        receiver: {},
        export: {},
      },
      connections: [],
      activeTab: 1,
      connection: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    const { gateway, settings } = nextProps;
    const currentConnection = gateway.getIn(['receiver', 'connections', 0]) === undefined ? {} :
      gateway.getIn(['receiver', 'connections', 0]).toJS();
    if (gateway) return this.setState({ connection: currentConnection, gateway: gateway.toJS()});
    return this.setState({gateway: {name: settings.get('name'), params: {}}});
  }

  onChangeParam = () => {
    const { onChangeParam, gateway } = this.props;
    onChangeParam(gateway.get('name'));
  };

  onChangeParamValue = (e) => {
    const { id, value } = e.target;
    const { gateway } = this.state;
    this.setState({gateway: Object.assign({}, gateway, {
      params: Object.assign({}, gateway.params, {
	[id]: value
      })
    })});
  };

  onChangeReceiverValue = (e) => {
    const { id, value } = e.target;
    const { gateway, connections, connection } = this.state;

    connection[id] = value;
    if (connections.length > 0) {
      connections[0][id] = value;
    } else {
      connections.push(connection);
    }

    this.setState({ connection,
      gateway: Object.assign({}, gateway, {
        receiver: Object.assign({}, gateway.receiver, {
          connections,
        }),
      }) });
  };

  onChangeExportValue = (e) => {
    const { id, value } = e.target;
    const { gateway } = this.state;

    this.setState({ gateway: Object.assign({}, gateway, {
      export: Object.assign({}, gateway.export, {
        [id]: value,
      }),
    }) });
  };

  onSave = () => {
    const { gateway } = this.state;
    const { onSave } = this.props;
    onSave(gateway);
  };

  onClose = () => {
    this.props.onClose();
    this.setState({gateway: {params: {}}});
  };

  handleSelectTab = (key) => {
    this.setState({ activeTab: key });
  }

  renderTabsBody = () => {
    const { settings } = this.props;
    const { gateway, activeTab } = this.state;
    const exportValue = gateway.export !== undefined ? gateway.export : [];
    const receiverValue = gateway.receiver !== undefined ? gateway.receiver : [];
    const connections = receiverValue.connections !== undefined ? receiverValue.connections : [];
    const connection = connections[0] !== undefined ? connections[0] : [];

    return (
      <Tabs activeKey={activeTab} animation={false} id="PaymentGatewayTab" onSelect={this.handleSelectTab}>
        <Tab title="API Parameters" eventKey={1}>
          <Panel style={{ borderTop: 'none' }}>
            <form className="form-horizontal">
              {settings.get('params').keySeq().map((param, paramKey) => (
                <div className="form-group" key={paramKey}>
                  <label className="col-lg-3 control-label">{param}</label>
                  <div className="col-lg-4">
                    <input type="text"
                      id={param}
                      onChange={this.onChangeParamValue}
                      className="form-control"
                      value={gateway['params'][param]} />
                  </div>
                </div>
              ))}
            </form>
          </Panel>
        </Tab>

        <Tab title="File Based Export" eventKey={2}>
          <Panel style={{ borderTop: 'none' }}>
            <form className="form-horizontal">
              {settings.get('export').keySeq().map((param, paramKey) => (
                <div className="form-group" key={paramKey}>
                  <label className="col-lg-3 control-label">{param}</label>
                  <div className="col-lg-4">
                    <input type="text"
                      id={param}
                      onChange={this.onChangeExportValue}
                      className="form-control"
                      value={exportValue[param]} />
                  </div>
                </div>
              ))}
            </form>
          </Panel>
        </Tab>

        <Tab title="File Based Receiver" eventKey={3}>
          <Panel style={{ borderTop: 'none' }}>
            <form className="form-horizontal">
              {settings.get('receiver').keySeq().map((param, paramKey) => (
                <div className="form-group" key={paramKey}>
                  <label className="col-lg-3 control-label">{param}</label>
                  <div className="col-lg-4">
                    <input type="text"
                      id={param}
                      onChange={this.onChangeReceiverValue}
                      className="form-control"
                      value={connection[param]} />
                  </div>
                </div>
              ))}
            </form>
          </Panel>
        </Tab>
      </Tabs>
    );
  }

  renderSingularBody = () => {
    const { settings } = this.props;
    const { gateway } = this.state;

    return (
      <form className="form-horizontal">
        {settings.get('params').keySeq().map((param, paramKey) => (
          <div className="form-group" key={paramKey}>
            <label className="col-lg-3 control-label">{param}</label>
            <div className="col-lg-4">
              <input type="text"
                id={param}
                onChange={this.onChangeParamValue}
                className="form-control"
                value={gateway['params'][param]} />
            </div>
          </div>
        ))}
      </form>
    );
  }

  renderModalBody = () => {
    const { settings } = this.props;
    const hasTabs = !settings.get('receiver').isEmpty() && !settings.get('export').isEmpty();

    if (hasTabs) {
      return (
        this.renderTabsBody()
      );
    }
    return (
      this.renderSingularBody()
    );
  }

  render() {
    const { settings, show = false } = this.props;

    return (

      <Modal show={show} onHide={this.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>{settings.get('name')} parameters</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { this.renderModalBody() }
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn btn-default" onClick={this.onClose}>Cancel</button>
          <button type="button" className="btn btn-primary" onClick={this.onSave}>Save</button>
        </Modal.Footer>
      </Modal>
    );
  }
}
