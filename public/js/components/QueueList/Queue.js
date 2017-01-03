import React, { Component } from 'react';
import Immutable from 'immutable';

import { getFieldName } from '../../common/Util';

export default class Queue extends Component {

  static propTypes = {
    line: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    onClickCancel: React.PropTypes.func,
  };

  static defaultProps = {
    line: Immutable.Map(),
    onClickCancel: () => {},
  };

  render() {
    const { line, onClickCancel } = this.props;
    const hiddenFields = [
      '_id', 'in_plan', 'over_plan', 'interconnect_aprice', 'out_plan',
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
                  if (hiddenFields.includes(field)) return (null);
                  return (
                    <div className="form-group" key={key}>
                      <label className="col-lg-2 control-label" htmlFor="input">{ getFieldName(field, 'queue') }</label>
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
