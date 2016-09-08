import React, { Component } from 'react';
import Immutable from 'immutable';

export default class List extends Component {
  constructor(props) {
    super(props);
  }

  printEntityField(entity = Immutable.Map(), field) {
    if (!Immutable.Iterable.isIterable(entity))
      return this.printEntityField(Immutable.fromJS(entity), field);
    if (field.parser)
      return field.parser(entity);
    return entity.get(field.id);
  }
  
  buildRow(entity, fields) {
    return fields.map((field, key) => (
      <td key={key}>
        { this.printEntityField(entity, field) }
      </td>
    ));
  }

  render() {
    const {
      items,
      fields,
      onClickRow = () => {}
    } = this.props;

    const table_header = fields.map((field, key) => (
      <th key={key}>{ field.title || field.placeholder }</th>
    ));

    const table_body = items.size < 1 ?
                       (<tr><td colSpan={fields.length} style={{textAlign: "center"}}>No items found</td></tr>) :
                       items.map((entity, index) => (
                         <tr key={index} onClick={onClickRow.bind(this, entity)}>
                           { this.buildRow(entity, fields) }
                         </tr>
                       ));

    return (
      <div className="List col-lg-12">
        <div className="table-responsive">
          <table className="table table-hover table-striped">
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
