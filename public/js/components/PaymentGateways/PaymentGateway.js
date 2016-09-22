import React, { Component } from 'react';

export default class PaymentGateway extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { settings, enabled } = this.props;
    const style = {};
    if (!enabled) {
      style.filter = "grayscale(100%)";
    }

    return (
      <div className="form-group" style={{border: "1px solid black"}}>
	<div className="col-lg-12">
	  {(() => {
	     if (!settings.get('image_url')) return (settings.get('name'));
	     return (
	       <img src={settings.get('image_url')} style={style} />
	     );
	   })()}
	</div>
	{settings.get('params').map((param, param_key) => (
	   <div className="form-group" key={param_key}>
	     <label className="col-xs-2 control-label">{param}</label>
	     <div className="col-lg-4">
	       <input type="text" className="form-control"
		      value={(enabled ? enabled.get(param) : "")} />
	     </div>
	   </div>
	 ))}
      </div>
    );
  }
}
