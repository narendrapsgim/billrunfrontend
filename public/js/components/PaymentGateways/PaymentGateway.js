import React, { Component } from 'react';

export default class PaymentGateway extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { gateway, curr, onCheck, onChangeParam } = this.props;
    const style = {};
    if (!curr) {
      style.filter = "grayscale(100%)";
    }

    return (
      <div className="form-group">
	<div className="col-lg-12">
	  <div className="checkbox">
	    <label>
	      <input type="checkbox" id={gateway.get('name')}
		     checked={curr !== undefined} onChange={onCheck.bind(this, gateway.get('name'))} />
	      {(() => {
		 if (!gateway.get('image_url')) return (gateway.get('name'));
		 return (
		   <img src={gateway.get('image_url')} style={style} />
		 );
	       })()}
	    </label>
	  </div>
	</div>
	{gateway.get('params').map((param, param_key) => (
	   <div className="form-group" key={param_key}>
	     <label className="col-xs-2 control-label">{param}</label>
	     <div className="col-lg-4">
	       <input type="text" className="form-control"
		      disabled={curr === undefined}
		      onChange={onChangeParam.bind(this, gateway.get('name'), param)}
		      value={(curr ? curr.get(param) : "")} />
	     </div>
	   </div>
	 ))}
      </div>
    );
  }
}
