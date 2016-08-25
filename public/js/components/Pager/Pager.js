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
    const { onClick } = this.props;
    const { id } = e.target;
    let { page } = this.state;
    if (id === "next") page++;
    else if (page > 0) page--;
    else {
      e.preventDefault()
      return;
    }
    this.setState({page}, () => {
      onClick(page)
    });
  }
  
  render() {
    let prevClass = "previous" + ( this.state.page === 0 ? ' disabled' : '' );
    return (
      <ul className="pagination">
        <li className={prevClass} onClick={this.handlePageClick}>
          <a id="previous">Previous</a>
        </li>
        <li className="active"><a href="#">{this.state.page + 1}</a></li>
        <li id="next" className="next" onClick={this.handlePageClick}>
          <a id="next">Next</a>
        </li>
      </ul>
    );
  }
}
