import React, { Component } from 'react';

/* COMPONENTS */
import GatewayParamsModal from './GatewayParamsModal';

export default class PaymentGateway extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showParamsModal: false
    };
  }

  onShowParams = () => {
    this.setState({showParamsModal: true});
  };

  onCloseParams = () => {
    this.setState({showParamsModal: false});
  };

  onSaveParams = (gateway) => {
    const { onSaveParams, enabled } = this.props;
    onSaveParams(gateway, enabled !== undefined);
    this.onCloseParams();
  };

  onClickEnable = () => {
    this.onShowParams();
  };

  onClickDisable = () => {
    const { onDisable, settings } = this.props;
    var r = confirm("Are you sure you want to disable this payment gateway?");
    if (r)
      onDisable(settings.get('name'));
  };
  
  render() {
    const { settings, enabled } = this.props;
    const { showParamsModal } = this.state;
    const style = {};
    if (!enabled) {
      style['WebkitFilter'] = style.filter = "grayscale(100%)";
    }

    return (
      <div>
	<GatewayParamsModal settings={settings}
			    show={showParamsModal}
			    gateway={enabled}
			    onSave={this.onSaveParams}
			    onClose={this.onCloseParams}
			    />
	<div className="form-group">
	  <div className="col-lg-8 col-md-8">
	    {(() => {
	       if (!settings.get('image_url')) return (settings.get('name'));
	       return (
		 <img src={settings.get('image_url')} style={style} />
	       );
	     })()}
	  </div>
	  <div className="col-lg-4 col-md-4">
	    <div className="pull-right">
	      <button onClick={this.onShowParams}
		      type="button"
		      className="btn btn-default btn-lg"
		      disabled={!enabled}>
		<i className="fa fa-gear"></i>
	      </button>
	    </div>
	  </div>
	</div>
	<div className="form-group">
	  <div className="col-lg-12 col-md-12">
	    <div className="pull-right">
	      {(() => {
		 if (!enabled) return (<button type="button" className="btn btn-success" onClick={this.onClickEnable}>Enable</button>);
		 return (<button type="button" className="btn btn-danger" onClick={this.onClickDisable}>Disable</button>);
	       })()}
	    </div>
	  </div>
	</div>
	<div className="separator"></div>
      </div>
    );
  }
}
