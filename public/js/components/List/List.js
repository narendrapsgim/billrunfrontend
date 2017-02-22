import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import moment from 'moment';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { OverlayTrigger, Tooltip } from 'react-bootstrap/lib';
import { Button } from 'react-bootstrap';
import Actions from '../Elements/Actions';

/* ACTIONS */
import { titlize } from '../../common/Util';

class List extends Component {

  static propTypes = {
    enableRemove: PropTypes.bool,
    onClickRemove: PropTypes.func,
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
    actions: [],
  };

  displayByType(field, entity) {
    switch (field.type) {
      case 'date':
        return moment(entity.get(field.id, 0)).format(globalSetting.dateFormat);
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
      case 'text':
      default:
        return entity.get(field.id);
    }
  }

  printEntityField(entity = Immutable.Map(), field) {
    if (!Immutable.Iterable.isIterable(entity))
      return this.printEntityField(Immutable.fromJS(entity), field);
    if (field.parser)
      return field.parser(entity);
    if (field.type)
      return this.displayByType(field, entity);
    return entity.get(field.id);
  }

  buildRow(entity, fields) {
    const { onClickEdit, edit } = this.props;
    return fields.map((field, key) => {
      if (field.display === false) {
        return null;
      }
      let fieldElement;
      if (edit && ((key === 0 && field.id !== 'state') || (key === 1 && fields[0].id === 'state'))) {
        fieldElement = (
          <button className="btn btn-link" onClick={onClickEdit.bind(this, entity)}>
            {this.printEntityField(entity, field)}
          </button>
        )
      } else {
        fieldElement = this.printEntityField(entity, field);
      }
      return (
        <td key={key} className={field.cssClass} >
          { fieldElement }
        </td>
      )
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
      actions,
    } = this.props;

    const table_header = fields.map((field, key) => {
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
        return (<th key={key} onClick={onclick} className={field.cssClass} style={style}>{titlize(field.id)}{arrow}</th>);
      }
      return (<th key={key} onClick={onclick} className={field.cssClass} style={style}>{field.title || field.placeholder}{arrow}</th>)
    });
    let colSpan = fields.length;
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

    const table_body = items.size < 1 ?
                       (<tr><td colSpan={colSpan} style={{textAlign: "center"}}>No items found</td></tr>) :
                        items.map((entity, index) => (
                            <tr key={index}>
                              { this.buildRow(entity, fields) }
                              {
                                edit &&
                                  <td className="edit-tb">
                                    <button className="btn btn-link" onClick={onClickEdit.bind(this, entity)}>
                                      { editText ?
                                        editText :
                                        <OverlayTrigger overlay={editTooltip} placement="left">
                                          <i className="fa fa-pencil" />
                                        </OverlayTrigger>
                                      }
                                    </button>
                                  </td>
                              }
                              {
                                enableRemove &&
                                  <td className="edit-tb">
                                    <Button onClick={onClickRemove.bind(this, entity)} bsSize="small" className="pull-left" ><i className="fa fa-trash-o danger-red" />&nbsp;Remove</Button>
                                  </td>
                              }
                              {
                                actions.length > 0 &&
                                  <td className="actions-tb">
                                    <Actions actions={actions} data={entity} />
                                  </td>
                              }
                            </tr>
                          )
                        );

    return (
      <div className={"List row " + className}>
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
