import React, { PropTypes } from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import classNames from 'classnames';


const Action = (props) => {
  const { type, label, data, actionStyle, showIcon, actionSize, actionClass } = props;

  if ((typeof props.show === 'boolean' && !props.show)
    || (typeof props.show === 'function' && !props.show(data))) {
    return null;
  }

  const isEnable = (typeof props.enable === 'function') ? props.enable(data) : props.enable;

  const iconClass = classNames('fa fa-fw', {
    'fa-eye': type === 'view',
    'fa-pencil': type === 'edit',
    'fa-files-o': type === 'clone',
    'danger-red': type === 'remove' || type === 'enable',
    'fa-trash-o': type === 'remove',
    'fa-toggle-off': type === 'enable',
    'fa-toggle-on': type === 'disable',
    'fa-plus': type === 'add',
    'fa-calendar': type === 'move',
    'fa-cloud-upload': type === 'import',
    'fa-refresh': type === 'refresh',
  });

  const onClick = () => {
    props.onClick(data);
  };

  const editTooltip = (
    <Tooltip id="tooltip">
      { (typeof props.helpText === 'string')
        ? props.helpText
        : props.helpText(data, type)
      }
    </Tooltip>
  );

  const button = (
    <Button
      onClick={onClick}
      bsStyle={actionStyle}
      bsSize={actionSize}
      className={actionClass}
      disabled={!isEnable}
    >
      { showIcon && <i className={iconClass} /> }
      { showIcon && label.length > 0 && <span>&nbsp;</span> }
      { label.length > 0 && label}
    </Button>
  );

  return (
    <span className="action-button">
      { (typeof props.helpText === 'string' && props.helpText !== '')
        ? <OverlayTrigger overlay={editTooltip} placement="top">{ props.renderFunc ? props.renderFunc(props) : button }</OverlayTrigger>
        : ( props.renderFunc ? props.renderFunc(props) : button )
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
  actionClass: '',
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
  actionSize: PropTypes.string,
  actionClass: PropTypes.string,
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
