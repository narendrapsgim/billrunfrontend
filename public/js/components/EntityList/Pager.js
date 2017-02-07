import React, { PropTypes } from 'react';

const Pager = (props) => {
  const { size, count, page, nextPage } = props;
  const offset = page * size;
  const prevClass = `previous${page === 0 ? ' disabled' : ''}`;
  const nextClass = `next${!nextPage ? ' disabled ' : ''}`;
  const showing = count === 0 ? 0 : `${offset + 1} to ${offset + count}`;
  const pageLabel = `Page ${page + 1}`;
  const sizeStyle = { paddingTop: 0, paddingBottom: 0, height: 25 };

  const onChangeSize = (e) => {
    const { value } = e.target;
    props.onChangeSize(value);
  };

  const handlePrevPage = (e) => {
    e.preventDefault();
    if (page > 0) {
      props.onChangePage(page - 1);
    }
  };

  const handleNextPageClick = (e) => {
    e.preventDefault();
    if (nextPage) {
      props.onChangePage(page + 1);
    }
  };

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="col-lg-6 pull-left" style={{ paddingLeft: 0 }}>
          <ul className="pagination">
            <li className={prevClass}>
              <a onClick={handlePrevPage}>
                <i className="fa fa-chevron-left" />
              </a>
            </li>
            <span className="detalis" style={{ padding: '0 10px' }}>{pageLabel} | {showing}</span>
            <li className={nextClass}>
              <a onClick={handleNextPageClick}>
                <i className="fa fa-chevron-right" />
              </a>
            </li>
          </ul>
        </div>
        <div className="col-lg-6 pull-right" style={{ paddingRight: 0 }}>
          { props.onChangeSize &&
            <select value={size} className="form-control" onChange={onChangeSize} style={sizeStyle}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          }
        </div>
      </div>
    </div>
  );
};

Pager.propTypes = {
  page: PropTypes.number,
  nextPage: PropTypes.bool,
  size: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  onChangeSize: PropTypes.func,
};

Pager.defaultProps = {
  page: 0,
  nextPage: false,
};

export default Pager;
