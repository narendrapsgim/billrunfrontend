import React, { Component } from 'react';
import _ from 'lodash';

export default class Pager extends Component {
  constructor(props) {
    super(props);

    this.handlePageClick = this.handlePageClick.bind(this);

    this.state = {
      page: 0
    };
  }

  handlePageClick(e) {
    const { onClick, size, count } = this.props;
    const { id } = e.target;
    let { page } = this.state;

    if (id === "next" && size <= count) {
      page++;
    } else if (id === "previous" && page > 0) {
      page--;
    } else {
      e.preventDefault()
      return;
    }
    this.setState({page}, () => {
      onClick(page)
    });
  }

  render() {
    const { size, count } = this.props;
    const { page } = this.state;
    const prevClass = "previous" + ( this.state.page === 0 ? ' disabled' : '' );
    const nextClass = "next" + (count < size ? ' disabled ' : '');
    const showing = (page * size + count) === 0 ? 'Showing none' : `Showing ${page * size + 1} to ${page * size + count}`;

    return (
      <div className="row">
        <div className="col-lg-12">
          <span style={{ verticalAlign: 'text-bottom' }}>{showing}&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <ul className="pagination">
            <li id="previous" className={prevClass}>
              <a id="previous" onClick={this.handlePageClick}>
                <i id="previous" className="fa fa-chevron-left"></i>
              </a>
            </li>
            <li id="next" className={nextClass}>
              <a id="next" onClick={this.handlePageClick}>
                <i id="next" className="fa fa-chevron-right"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
