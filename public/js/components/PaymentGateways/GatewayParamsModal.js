import React, { Component } from 'react';
import Modal from 'react-bootstrap/lib/Modal';

export default class GatewayParamsModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gateway: {
	params: {}
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    const { gateway, settings } = nextProps;
    if (gateway) return this.setState({gateway: gateway.toJS()});
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
  
  onSave = () => {
    const { gateway } = this.state;
    const { onSave } = this.props;
    onSave(gateway);
  };

  onClose = () => {
    this.props.onClose();
    this.setState({gateway: {params: {}}});
  };
  
  render() {
    const { settings,
	    show = false } = this.props;
    const { gateway } = this.state;

    return (
      <Modal show={show} onHide={this.onClose}>
	<Modal.Header closeButton>
	  <Modal.Title>{settings.get('name')} parameters</Modal.Title>
	</Modal.Header>
	<Modal.Body>
	  <form className="form-horizontal">
	    {settings.get('params').keySeq().map((param, param_key) => (
	       <div className="form-group" key={param_key}>
		 <label className="col-lg-2 control-label">{param}</label>
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
	</Modal.Body>
	<Modal.Footer>
	  <button type="button" className="btn btn-default" onClick={this.onClose}>Cancel</button>
	  <button type="button" className="btn btn-primary" onClick={this.onSave}>Save</button>		
	</Modal.Footer>
      </Modal>
    );
  }
}
