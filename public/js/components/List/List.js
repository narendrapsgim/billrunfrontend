import React, { Component } from 'react';
import Immutable from 'immutable';
import moment from 'moment';
import { connect } from 'react-redux';

import { OverlayTrigger, Tooltip } from 'react-bootstrap/lib';
import { Button } from 'react-bootstrap';

/* ACTIONS */
import { titlize } from '../../common/Util';

class List extends Component {
  constructor(props) {
    super(props);

    this.onClickHeader = this.onClickHeader.bind(this);

    this.state = {
      sort: {},
    };
  }

  static propTypes = {
    enableRemove: React.PropTypes.bool,
    onClickRemove: React.PropTypes.func,
    removeText: React.PropTypes.string,
    enableEnabled: React.PropTypes.bool,
    onClickEnabled: React.PropTypes.func,
  };

  static defaultProps = {
    enableRemove: false,
    onClickRemove: () => {},
    removeText: 'Remove',
    enableEnabled: false,
    onClickEnabled: () => {},
  };

  displayByType(field, entity) {
    switch (field.type) {
      case 'date':
        return moment(entity.get(field.id)).format(globalSetting.dateFormat);
      case 'time':
        return moment(entity.get(field.id)).format(globalSetting.timeFormat);
      case 'datetime':
        return moment(entity.get(field.id)).format(globalSetting.datetimeFormat);
      case 'timestamp':
        return moment(parseInt(entity.get(field.id), 10) * 1000)
          .format(globalSetting.datetimeFormat);
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
    const {
      onClickEdit = () => {
      },
      editField,
    } = this.props;

    return fields.map((field, key) => {
      if (field.display === false) {
        return null;
      }
      let fieldElement;

      if (editField && editField === field.id) {
        fieldElement = (
          <button className="btn btn-link" onClick={onClickEdit.bind(this, entity)}>
            {this.printEntityField(entity, field)}
          </button>
        )
      } else {
        fieldElement = this.printEntityField(entity, field);
      }
      return (
        <td key={key}>
          { fieldElement }
        </td>
      )

    });
  }

  onClickHeader(field) {
    const { onSort = () => {} } = this.props;
    const { sort } = this.state;
    const sort_dir = sort[field] === -1 ? 1 : -1;
    this.setState({sort: {[field]: sort_dir}}, () => {
      onSort(JSON.stringify(this.state.sort));
    });
  }

  render() {
    const {
      items,
      fields = [],
      onClickEdit = () => {},
      edit = false,
      editText,
      className,
      enableRemove,
      onClickRemove,
      removeText,
      enableEnabled,
      onClickEnabled,
    } = this.props;

    const { showConfirmRemove } = this.state;

    let table_header = fields.map((field, key) => {
      let onclick = field.sort ? this.onClickHeader.bind(this, field.id) : () => {};
      let style = field.sort ? { cursor: "pointer" } : {};
      let arrow = (null);
      if (field.display === false) {
        return null;
      }

      if (field.sort) {
	arrow = this.state.sort[field.id] ? (<i className={`sort-indicator fa fa-sort-${ this.state.sort[field.id] === 1 ? 'up' : 'down' }`}></i>) : (<i className="sort-indicator fa fa-sort"></i>);
      }
      if (!field.title && !field.placeholder) return (<th key={key} onClick={onclick} style={style}>{ titlize(field.id) }{ arrow }</th>);
        return (<th key={key} onClick={onclick} className={field.cssClass} style={style}>{ field.title || field.placeholder }{ arrow }</th>)
    });
    if (enableEnabled) table_header = [(<th key={-1}></th>), ...table_header]
    if (edit) table_header.push((<th key={fields.length}>&nbsp;</th>));
    if (enableRemove) table_header.push((<th key={fields.length + 1}>&nbsp;</th>));

    const editTooltip = (
      <Tooltip id="tooltip">{ editText ?editText : 'Edit'}</Tooltip>
    );
    const removeTooltip = (
      <Tooltip id="tooltip">{ removeText }</Tooltip>
    );

    const table_body = items.size < 1 ?
                       (<tr><td colSpan={fields.length + (edit ? 1 : 0)} style={{textAlign: "center"}}>No items found</td></tr>) :
                        items.map((entity, index) => (
                            <tr key={index} className={entity.get('enabled', true) ? '' : 'disabled'}>
                              {
                                enableEnabled ?
                                  <td className="edit-tb">
                                    <input type="checkbox" checked={entity.get('enabled', true)} onChange={onClickEnabled.bind(this, entity)} />
                                  </td>
                                : null
                              }
                              { this.buildRow(entity, fields) }
                              {
                                edit ?
                                  <td className="edit-tb">
                                    <button className="btn btn-link" onClick={onClickEdit.bind(this, entity)}>
                                      { editText ?
                                        editText :
                                        <OverlayTrigger overlay={editTooltip} placement="left">
                                          <i className="fa fa-pencil" />
                                        </OverlayTrigger>
                                      }
                                    </button>
                                  </td> : null
                              }
                              {
                                enableRemove ?
                                  <td className="edit-tb">
                                    <button onClick={onClickRemove.bind(this, entity)} disabled={entity.get('enabled', true)} className="btn btn-link" >
                                      <OverlayTrigger overlay={removeTooltip} placement="left">
                                        <i className="fa fa-trash-o danger-red" />
                                      </OverlayTrigger>
                                    </button>
                                  </td>
                                : null
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
