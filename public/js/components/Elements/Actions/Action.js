import React, { PropTypes } from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import classNames from 'classnames';


const Action = (props) => {
  const { type, label, data, actionStyle, showIcon } = props;

  if ((typeof props.show === 'boolean' && !props.show)
    || (typeof props.show === 'function' && !props.show(data))) {
    return null;
  }

  const isEnable = (typeof props.enable === 'function') ? props.enable(data) : props.enable;

  const iconClass = classNames('fa', {
    'fa-eye': type === 'view',
    'fa-pencil': type === 'edit',
    'fa-files-o': type === 'clone',
    'danger-red': type === 'remove',
    'fa-trash-o': type === 'remove',
  });

  const onClick = () => {
    props.onClick(data);
  };

  const editTooltip = (
    <Tooltip id="tooltip">
      { (typeof props.helpText === 'string')
        ? props.helpText
        : props.helpText(data)
      }
    </Tooltip>
  );

  const button = (
    <Button onClick={onClick} bsStyle={actionStyle} disabled={!isEnable}>
      { showIcon && <i className={iconClass} /> }
      { showIcon && label.length > 0 && <span>&nbsp;</span> }
      { label.length > 0 && label}
    </Button>
  );

  return (
    <span className="action-button">
      { (typeof props.helpText === 'string' && props.helpText !== '')
        ? <OverlayTrigger overlay={editTooltip} placement="top">{ button }</OverlayTrigger>
        : button
      }
    </span>
  );
};

Action.defaultProps = {
  type: '',
  data: null,
  label: '',
  helpText: '',
  actionStyle: 'link',
  showIcon: true,
  enable: true,
  show: true,
  onClick: () => {},
};

Action.propTypes = {
  type: PropTypes.string,
  data: PropTypes.any,
  label: PropTypes.string,
  showIcon: PropTypes.bool,
  actionStyle: PropTypes.string,
  helpText: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
  enable: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func,
  ]),
  show: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func,
  ]),
  onClick: () => {},
};

export default Action;
