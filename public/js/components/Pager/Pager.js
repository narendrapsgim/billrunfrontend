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
        <div className="col-lg-2">
          { showing }
        </div>
        <div className="col-lg-10">
          <ul className="pagination" style={{margin: 0, padding: 0, cursor: "pointer"}}>
            <li id="previous" className={prevClass} onClick={this.handlePageClick}>
              <a id="previous" onClick={this.handlePageClick}>
                <i id="next" className="fa fa-chevron-left" onClick={this.handlePageClick}></i>
              </a>
            </li>
            <li id="next" className={nextClass} onClick={this.handlePageClick}>
              <a id="next" onClick={this.handlePageClick}>
                <i id="next" className="fa fa-chevron-right" onClick={this.handlePageClick}></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
