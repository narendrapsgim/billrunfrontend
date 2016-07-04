import React, { Component } from 'react';
import _ from 'lodash';

import BackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import ForwardIcon from 'material-ui/svg-icons/navigation/arrow-forward';
import FloatingActionButton from 'material-ui/FloatingActionButton';

const styles = {
  pagination : {
    paginationBar : {
      margin : '10px',
    },
    paginationButton : {
      margin : '10px',
    },
  }
};

export default class Pager extends Component {
  constructor(props) {
    super(props);
  }

  _setVisiblePages(totalPages, currentPage){
    let visiblePages = [1,currentPage,totalPages]; // always show first current and last
    let more = _.range(parseInt(currentPage), parseInt(currentPage)+3); // show 2 item after
    let less = _.range(parseInt(currentPage), Math.max(parseInt(currentPage)-3,0) , -1);  // show 2 item before
    return _.uniq([...visiblePages, ...more, ...less]);
  }
  
  render() {
    const getPager = () => {
      let { totalPages,
            currentPage,
            onPaginationClick } = this.props;
      let pages = [];
      if(totalPages > 1) {
        pages.push(
          <FloatingActionButton
              key='back'
              mini={true}
              style={styles.pagination.paginationButton}
              onClick={onPaginationClick}
              value='back'
              secondary={false}
              disabled={currentPage == 1}>
            <BackIcon />
          </FloatingActionButton>
        );
        let pagesToDisplay = this._setVisiblePages(totalPages, currentPage);
        for (var i = 1; i <= totalPages; i++) {
          if(pagesToDisplay.includes(i)){
            pages.push(
              <FloatingActionButton
                  key={i}
                  mini={true}
                  style={styles.pagination.paginationButton}
                  onClick={onPaginationClick}
                  value={i}
                  disabled={currentPage == i}>
                <spam>{i}</spam>
              </FloatingActionButton>)
          } else {
            if(pages[pages.length-1] !== "..."){
              pages.push('...');
            }
          }
        }
        pages.push(
          <FloatingActionButton
              key='forward'
              mini={true}
              style={styles.pagination.paginationButton}
              onClick={onPaginationClick}
              value='forward'
              secondary={false}
              disabled={currentPage == totalPages}>
            <ForwardIcon />
          </FloatingActionButton>
        );

        return (
          <div>
            <div style={styles.pagination.paginationBar}>{pages}</div>
          </div>
        )
      }
      return (null);
    }

    return (
      <div>
        { getPager() }
      </div>
    );
  }
}
