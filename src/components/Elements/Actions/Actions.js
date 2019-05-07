import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Action from './Action';
import { ButtonGroup } from 'react-bootstrap';

const Actions = ({ actions, data, isGroup }) => {
  if (isGroup) {
    return (
      <ButtonGroup className="actions-buttons">
        { actions.map((action, idx) => (<Action {...action} data={data} key={idx} />))}
      </ButtonGroup>
    );
  }
  return (
    <div className="actions-buttons">
      { actions.map((action, idx, list) => {
        const isLast = idx === (list.length - 1);
        let isEnable = true;
        if (typeof action.show !== 'undefined') {
          isEnable = (typeof action.show === 'function') ? action.show(data) : action.show;
        }
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
}

Actions.defaultProps = {
  actions: [],
  data: null,
  isGroup: false,
};

Actions.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.object),
  data: PropTypes.any,
  isGroup: PropTypes.bool,
};

export default Actions;
