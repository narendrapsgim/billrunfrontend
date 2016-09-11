import React, { Component } from 'react';

import { DropdownButton, MenuItem } from "react-bootstrap";

export default class ListPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { fields,
            items,
            pageSize,
            filter = false,
            actions = {show: false},
            handlePageClick,
            onClickRow = () => {},
            base } = this.props;

    const actions_dropdown = actions.show ? (
      <div className="pull-right">
        <DropdownButton title="Actions" id="ActionsDropDown" bsSize="xs" pullRight>
          { actions_dropdown_options }
        </DropdownButton>
      </div>
    ) : (null);
    
    return (
      <div>

        <div className="row">
          <div className="col-lg-12">
            <div className="panel panel-default">

              <div className="panel-heading">
                <span>
                  List of all available customers
                </span>
                { actions_dropdown }
              </div>

              <div className="panel-body">
                <Filter fields={fields} onFilter={this.onFilter} base={base} />
                <List items={items} fields={fields} onClickRow={onClickRow} />
              </div>

            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6">
            <div className="dataTables_info" role="status" aria-live="polite">Showing 1 to 10</div>
          </div>
          <div className="col-lg-6 dataTables_pagination">
            <Pager onClick={handlePageClick}
                   size={pageSize}
                   count={items.size || 0} />  
          </div>
        </div>

      </div>
    );
  }
}
