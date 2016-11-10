import React, { Component } from 'react';
import { getFieldName } from '../../common/Util';

export default class Usage extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const { line, onClickCancel } = this.props;
    const hidden_fields = [
      "_id", "in_plan", "over_plan", "interconnect_aprice", "out_plan"
    ];

    return (
      <form className="form-horizontal">
	<div className="form-group">
	  <div className="col-lg-12">
	    <button type="button" onClick={onClickCancel} className="btn btn-default">Back</button>
	  </div>
	</div>
	<div className="form-group">
	  <div className="col-lg-12">
	    <div className="panel panel-default">
	      <div className="panel-body">
		{line.keySeq().map((field, key) => {
		   if (hidden_fields.includes(field)) return (null);
		   return (
		     <div className="form-group" key={key}>
		       <label className="col-lg-2 control-label">{ getFieldName(field, 'lines') }</label>
		       <div className="col-lg-4">
			 <input disabled className="form-control" value={line.get(field)} />
		       </div>
		     </div>
		   );
		})}
	      </div>
	    </div>
	    <button type="button" onClick={onClickCancel} className="btn btn-default">Back</button>
	  </div>
	</div>
      </form>
    );
  }
}
