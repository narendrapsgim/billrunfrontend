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

    if (id === "next" && size < count) {
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
    const prevClass = "previous" + ( this.state.page === 0 ? ' disabled' : '' );
    const nextClass = "next" + (count < size ? ' disabled ' : '');

    return (
      <ul className="pagination">
        <li id="previous" className={prevClass} onClick={this.handlePageClick}>
          <a id="previous">Previous</a>
        </li>
        <li className="active"><a>{this.state.page + 1}</a></li>
        <li id="next" className={nextClass} onClick={this.handlePageClick}>
          <a id="next">Next</a>
        </li>
      </ul>
    );
  }
}
