import React from 'react';
import htmlHeader from './assests/header.html';
import htmlSummary from './assests/summary.html';
import htmlFooter from './assests/footer.html';
import './assests/style/invoice.scss';
import './assests/style/font.scss';

const Invoice = () => (
  <div className="scale70">
    <div className="invoice-help">
      <div dangerouslySetInnerHTML={{ __html: htmlHeader }} />
      <div dangerouslySetInnerHTML={{ __html: htmlSummary }} />
      <div dangerouslySetInnerHTML={{ __html: htmlFooter }} />
    </div>
  </div>
);

Invoice.defaultProps = {

};

Invoice.propTypes = {

};

export default Invoice;
