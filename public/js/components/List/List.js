import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import moment from 'moment';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { titleCase } from 'change-case';
import { OverlayTrigger, Tooltip } from 'react-bootstrap/lib';
import { Button } from 'react-bootstrap';
import { Actions, ZoneDate }  from '../Elements';

/* ACTIONS */
import { titlize } from '../../common/Util';

class List extends Component {

  static propTypes = {
    enableRemove: PropTypes.bool,
    onClickRemove: PropTypes.func,
    removeText: React.PropTypes.string,
    enableEnabled: React.PropTypes.bool,
    onClickEnabled: React.PropTypes.func,
    onSort: PropTypes.func,
    sort: PropTypes.instanceOf(Immutable.Map),
    actions: PropTypes.arrayOf(PropTypes.object),
  };

  static defaultProps = {
    enableRemove: false,
    onClickRemove: () => {},
    onClickEdit: () => {},
    onSort: () => {},
    sort: Immutable.Map(),
    removeText: 'Remove',
    enableEnabled: false,
    onClickEnabled: () => {},
    actions: [],
  };

  displayByType(field, entity) {
    switch (field.type) {
      case 'date':
        return <ZoneDate value={moment(entity.get(field.id, 0))} format={globalSetting.dateFormat} />;
      case 'time':
        return moment(entity.get(field.id, 0)).format(globalSetting.timeFormat);
      case 'datetime':
        return moment(entity.get(field.id, 0)).format(globalSetting.datetimeFormat);
      case 'mongodate':
        return moment.unix(entity.getIn([field.id, 'sec'], 0)).format(globalSetting.dateFormat);
      case 'mongotime':
        return moment.unix(entity.getIn([field.id, 'sec'], 0)).format(globalSetting.timeFormat);
      case 'mongodatetime':
        return moment.unix(entity.getIn([field.id, 'sec'], 0)).format(globalSetting.datetimeFormat);
      case 'timestamp':
        return moment.unix(entity.get(field.id, 0)).format(globalSetting.datetimeFormat);
      case 'fullDate':
        return moment.unix(entity.getIn([field.id, 'sec'])).format(globalSetting.datetimeLongFormat);
      case 'text':
      default:
        return entity.get(field.id, '');
    }
  }

  printEntityField(entity = Immutable.Map(), field) {
    if (!Immutable.Iterable.isIterable(entity)) {
      return this.printEntityField(Immutable.fromJS(entity), field);
    }
    if (field.parser) {
      return field.parser(entity, field);
    }
    return this.displayByType(field, entity);
  }

  getRowAction = (row, idx, entity) => {
    const { actions } = this.props;
    const rowActions = actions.filter((action) => {
      const ruleExist = typeof action.onClickColumn !== 'undefined';
      const byId = action.onClickColumn === row.id;
      const byIndex = action.onClickColumn === idx;
      return ruleExist && (byId || byIndex);
    });
    if (rowActions.length === 0) {
      return false;
    }
    // Find first enable and show onClick Actin
    const onClickAction = rowActions.reduce((action, rowAction) => {
      if (action === false) {
        if (typeof rowAction.onClick === 'undefined') {
          return false;
        }
        if (typeof rowAction.enable !== 'undefined') {
          const isEnable = (typeof rowAction.enable === 'function') ? rowAction.enable(entity) : rowAction.enable;
          if (!isEnable) {
            return false;
          }
        }
        if (typeof rowAction.show !== 'undefined') {
          const isShow = (typeof rowAction.show === 'function') ? rowAction.show(entity) : rowAction.show;
          if (!isShow) {
            return false;
          }
        }
        return rowAction.onClick;
      }
      return action;
    }, false);
    return onClickAction;
  }

  buildRow(entity, fields) {
    const { onClickEdit, edit } = this.props;
    return fields.map((field, key) => {
      if (field.display === false) {
        return null;
      }
      let fieldElement;
      const rowAction = this.getRowAction(field, key, entity);
      if (rowAction) {
        fieldElement = (
          <button className="btn btn-link" onClick={rowAction.bind(this, entity)}>
            {this.printEntityField(entity, field)}
          </button>
        );
      } else if (edit && ((key === 0 && field.id !== 'state') || (key === 1 && fields[0].id === 'state'))) {
        fieldElement = (
          <button className="btn btn-link" onClick={onClickEdit.bind(this, entity)}>
            {this.printEntityField(entity, field)}
          </button>
        );
      } else {
        fieldElement = this.printEntityField(entity, field);
      }
      return (
        <td key={key} className={field.cssClass} >
          { fieldElement }
        </td>
      );
    });
  }

  onClickHeader = (field) => {
    const { sort } = this.props;
    const sortdir = sort.get(field, 1) * -1;
    this.props.onSort({ [field]: sortdir });
  }

  render() {
    const {
      sort,
      items,
      fields = [],
      onClickEdit,
      edit = false,
      editText,
      className,
      enableRemove,
      onClickRemove,
      removeText,
      enableEnabled,
      onClickEnabled,
      actions,
    } = this.props;

    let table_header = fields.map((field, key) => {
      const onclick = field.sort ? this.onClickHeader.bind(this, field.id) : () => {};
      const style = field.sort ? { cursor: 'pointer' } : {};
      let arrow = null;
      if (field.display === false) {
        return null;
      }
      if (field.sort) {
        const arrowClass = classNames('sort-indicator', 'fa', {
          'fa-sort-down': sort.get(field.id, 0) === -1,
          'fa-sort-up': sort.get(field.id, 0) === 1,
          'fa-sort': sort.get(field.id, 0) === 0,
        });
        arrow = (<i className={arrowClass} />);
      }
      if (!field.title && !field.placeholder) {
        return (<th key={key} onClick={onclick} className={field.cssClass} style={style}>{titleCase(field.id)}{arrow}</th>);
      }
      return (<th key={key} onClick={onclick} className={field.cssClass} style={style}>{field.title || field.placeholder}{arrow}</th>);
    });
    let colSpan = fields.length;
    if (enableEnabled) {
      table_header = [(<th key={-1} />), ...table_header];
      colSpan += 1;
    }
    if (edit) {
      table_header.push((<th key={fields.length}>&nbsp;</th>));
      colSpan += 1;
    }
    if (enableRemove) {
      table_header.push((<th key={fields.length + 1}>&nbsp;</th>));
      colSpan += 1;
    }
    if (actions.length > 0) {
      table_header.push((<th key={fields.length + 1}>&nbsp;</th>));
      colSpan += 1;
    }

    const editTooltip = (
      <Tooltip id="tooltip">{ editText || 'Edit'}</Tooltip>
    );

    const table_body = !items
      ? null
      : (items.size < 1
        ? (<tr><td colSpan={colSpan} style={{ textAlign: 'center' }}>No items found</td></tr>)
        : items.map((entity, index) => (
            <tr key={index} className={entity.get('enabled', true) ? '' : 'disabled disabled-bg'}>
              { enableEnabled && (
                <td className="edit-tb">
                  <input type="checkbox" checked={entity.get('enabled', true)} onChange={onClickEnabled.bind(this, entity)} />
                </td>
              )}
              { this.buildRow(entity, fields) }
              { edit && (
                <td className="edit-tb">
                  <button className="btn btn-link" onClick={onClickEdit.bind(this, entity)}>
                    { editText
                      ? editText
                      : (
                        <OverlayTrigger overlay={editTooltip} placement="left">
                          <i className="fa fa-pencil" />
                        </OverlayTrigger>
                    )}
                  </button>
                </td>
              )}
              { enableRemove && (
                <td className="edit-tb">
                  <Button onClick={onClickRemove.bind(this, entity)} bsSize="small" className="pull-left" >
                    <i className="fa fa-trash-o danger-red" />&nbsp;Remove
                  </Button>
                </td>
              )}
              { actions.length > 0 && (
                <td className="td-actions">
                  <Actions actions={actions} data={entity} />
                </td>
              )}
            </tr>
          ),
        )
      );

    return (
      <div className={`List row ${className}`}>
        <div className="table-responsive col-lg-12">
          <table className="table table-hover table-striped table-bordered">
            <thead>
              <tr>{ table_header }</tr>
            </thead>
            <tbody>
              { table_body }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default connect()(List);
