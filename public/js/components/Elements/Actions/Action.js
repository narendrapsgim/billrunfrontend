import React, { PropTypes } from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import classNames from 'classnames';


const Action = (props) => {
  const { type, label, data, actionStyle, showIcon, actionSize, actionClass } = props;

  if ((typeof props.show === 'boolean' && !props.show)
    || (typeof props.show === 'function' && !props.show(data, type))) {
    return null;
  }

  const isEnable = (typeof props.enable === 'function') ? props.enable(data, type) : props.enable;

  const iconClass = classNames('fa fa-fw', {
    'fa-eye': type === 'view',
    'fa-pencil': type === 'edit',
    'fa-files-o': type === 'clone',
    'fa-file-excel-o': type === 'export_csv',
    'danger-red': ['enable', 'remove'].includes(type),
    'fa-trash-o': type === 'remove',
    'fa-toggle-off': type === 'enable',
    'fa-toggle-on': type === 'disable',
    'fa-plus': ['add', 'expand'].includes(type),
    'fa-calendar': type === 'move',
    'fa-repeat': type === 'reopen',
    'fa-cloud-upload': type === 'import',
    'fa-refresh': type === 'refresh',
    'fa-arrow-left': type === 'back',
    'fa-minus': type === 'collapse',
  });

  const onClick = () => {
    props.onClick(data, type);
  };

  const editTooltip = (
    <Tooltip id="tooltip">
      { (typeof props.helpText === 'string')
        ? props.helpText
        : props.helpText(data, type)
      }
    </Tooltip>
  );

  const button = props.renderFunc
  ? props.renderFunc(props)
  : (
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
      { (props.helpText !== '')
        ? (<OverlayTrigger overlay={editTooltip} placement="top">{ button }</OverlayTrigger>)
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
  actionSize: undefined,
  actionClass: '',
  showIcon: true,
  enable: true,
  show: true,
  renderFunc: null,
  onClick: () => {},
};

Action.propTypes = {
  type: PropTypes.string,
  data: PropTypes.any,
  label: PropTypes.string,
  showIcon: PropTypes.bool,
  actionStyle: PropTypes.oneOf(['primary', 'success', 'info', 'warning', 'danger', 'link']),
  actionSize: PropTypes.oneOf(['large', 'small', 'xsmall']),
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
  renderFunc: PropTypes.func,
  onClick: PropTypes.func,
};

export default Action;
