import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { getFieldName } from '../../common/Util';


const Usage = ({ line, onClickCancel, hiddenFields, cancelLabel }) => {
  const renderFields = () => line.keySeq().map((field, key) => {
    if (hiddenFields.includes(field)) {
      return (null);
    }
    return (
      <div className="form-group" key={key}>
        <label className="col-lg-2 control-label">{ getFieldName(field, 'lines') }</label>
        <div className="col-lg-4">
          <input disabled className="form-control" value={line.get(field)} />
        </div>
      </div>
    );
  });

  return (
    <form className="form-horizontal">
      <div className="form-group">
        <div className="col-lg-12">
          <button type="button" onClick={onClickCancel} className="btn btn-default">{cancelLabel}</button>
        </div>
      </div>
      <div className="form-group">
        <div className="col-lg-12">
          <div className="panel panel-default">
            <div className="panel-body">
              { renderFields() }
            </div>
          </div>
          <button type="button" onClick={onClickCancel} className="btn btn-default">{cancelLabel}</button>
        </div>
      </div>
    </form>
  );
};

Usage.defaultProps = {
  line: Immutable.Map(),
  hiddenFields: ['_id', 'in_plan', 'over_plan', 'interconnect_aprice', 'out_plan'],
  onClickCancel: () => {},
  cancelLabel: 'Back',
};

Usage.propTypes = {
  line: PropTypes.instanceOf(Immutable.Record),
  hiddenFields: PropTypes.element,
  onClickCancel: PropTypes.func,
  cancelLabel: PropTypes.string,
};

export default Usage;
