import React, { Component } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';


class Pager extends Component {

  static propTypes = {
    pager: React.PropTypes.instanceOf(Immutable.Map),
    size: React.PropTypes.number,
    count: React.PropTypes.number,
    onClick: React.PropTypes.func,
  }

  state = {
    page: 0,
  }

  handlePageClick = (e) => {
    e.preventDefault();
    const { pager } = this.props;
    const { id } = e.target;
    let { page } = this.state;

    if (id === 'next' && pager.get('nextPage', true)) {
      page += 1;
    } else if (id === 'previous' && page > 0) {
      page -= 1;
    } else {
      return;
    }
    this.setState({ page });
    this.props.onClick(page);
  }

  render() {
    const { size, count, pager } = this.props;
    const { page } = this.state;
    const offset = page * size;
    const prevClass = `previous${this.state.page === 0 ? ' disabled' : ''}`;
    const nextClass = `next${!pager.get('nextPage') ? ' disabled ' : ''}`;
    const showing = (offset + count) === 0 ? 'Showing none' : `Showing ${offset + 1} to ${offset + count}`;

    return (
      <div className="row">
        <div className="col-lg-12">
          <ul className="pagination">
            <span className="detalis">{showing}</span>
            <li id="previous" className={prevClass}>
              <a id="previous" onClick={this.handlePageClick}>
                <i id="previous" className="fa fa-chevron-left" />
              </a>
            </li>
            <li id="next" className={nextClass}>
              <a id="next" onClick={this.handlePageClick}>
                <i id="next" className="fa fa-chevron-right" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  pager: state.pager,
});

export default connect(mapStateToProps)(Pager);
