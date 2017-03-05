import React, { PropTypes } from 'react';
import classNames from 'classnames';
import Action from './Action';

const Actions = ({ actions, data }) => (
  <div className="actions-buttons">
    { actions.map((action, idx, list) => {
      const isLast = idx === (list.length - 1);
      const isEnable = (typeof action.show === 'function') ? action.show(data) : action.show;
      const actionClass = classNames({
        mr10: !isLast && isEnable,
        mr0: isLast || !isEnable,
      });
      return (
        <span key={idx} className={actionClass} >
          <Action {...action} data={data} />
        </span>
      );
    })}
  </div>
);


Actions.defaultProps = {
  actions: [],
  data: null,
};

Actions.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.object),
  data: PropTypes.any,
};

export default Actions;
