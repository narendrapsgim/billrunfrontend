import React, { Component } from 'react';
import { connect } from 'react-redux';

class Pager extends Component {
  constructor(props) {
    super(props);

    this.handlePageClick = this.handlePageClick.bind(this);

    this.state = {
      page: 0
    };
  }

  handlePageClick(e) {
    const { onClick, size, count, pager } = this.props;
    const { id } = e.target;
    let { page } = this.state;

    if (id === "next" && pager.get('nextPage', true)) {
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
    const { size, count, pager } = this.props;
    const { page } = this.state;

    const prevClass = "previous" + ( this.state.page === 0 ? ' disabled' : '' );
    const nextClass = "next" + (!pager.get('nextPage') ? ' disabled ' : '');
    const showing = (page * size + count) === 0 ? 'Showing none' : `Showing ${page * size + 1} to ${page * size + count}`;

    return (
      <div className="row">
        <div className="col-lg-12">
          <ul className="pagination">
            <span className="detalis">{showing}</span>
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

function mapStateToProps(state) {
  return {
    pager: state.pager
  };
}

export default connect(mapStateToProps)(Pager);
