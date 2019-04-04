import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { Label } from 'react-bootstrap';
import { CSVLink } from 'react-csv';


const StepResult = (props) => {
  const { item } = props;
  const fileDelimiter = item.get('fileDelimiter', ',');
  const fileContent = item.get('fileContent', []) || [];
  const fileName = item.get('fileName', 'errors');
  const result = item.get('result', []) || [];

  const getErrorCsvHeaders = () => (
    [...fileContent[0], 'import_error_message', 'import_error_row']
  );

  const getErrorCsvData = () => {
    const rows = [];
    result.forEach((status, index) => {
      if (status !== true) {
        const csvIndex = index + 1; // first line is headers
        const originalIndex = csvIndex + 1; // csv row start form 1
        if (fileContent[csvIndex]) {
          rows.push([...fileContent[csvIndex], status, originalIndex]);
        }
      }
    });
    return rows;
  };

  const rendeDetails = () => (
    <ol className="scrollbox">
      { result.map((status, key) => {
        const error = status !== true;
        const label = error ? status : 'Success';
        const bsStyle = error ? 'danger' : 'success';
        return (
          <li key={key}>
            <Label bsStyle={bsStyle}>{label}</Label>
          </li>
        );
      })}
    </ol>
  );

  const renderStatus = () => {
    // No resolts -> no imports
    if (result.length === 0) {
      return (
        <div>
          <Label bsStyle="default">No records were imported</Label>
        </div>
      );
    }
    // All rows was successfully imported
    const allSuccess = result.every(status => status === true);
    if (allSuccess) {
      return (
        <div>
          <Label bsStyle="success">{result.length} records were successfully imported</Label>
        </div>
      );
    }
    // All rows was faild imported
    const allFails = result.every(status => status !== true);
    if (allFails) {
      return (
        <div>
          <p>No records were imported, please fix errors and try again.</p>
          <hr style={{ marginBottom: 0 }} />
          {rendeDetails()}
        </div>
      );
    }
    // Mixed, some pased some fails
    const success = result.filter(status => status === true);
    const errorCsvData = getErrorCsvData();
    const errorCsvHeaders = getErrorCsvHeaders();

    return (
      <div>
        <p>
          <Label bsStyle="success">{success.length}</Label> rows were successfully imported.<br />
          <Label bsStyle="danger">{result.length - success.length}</Label> rows were faild import.<br />
          Please remove successfully imported rows from file, fix errors and try again.
        </p>
        <CSVLink
          data={errorCsvData}
          headers={errorCsvHeaders}
          separator={fileDelimiter}
          filename={`errors_${fileName}`}
        >
          Click here to download CSV file with errors
        </CSVLink>
        <hr style={{ marginBottom: 0 }} />
        {rendeDetails()}
      </div>
    );
  };

  return (
    <div className="StepResult">
      <h4>Import status</h4>
      {renderStatus()}
    </div>
  );
};

StepResult.defaultProps = {
  item: Immutable.Map(),
};

StepResult.propTypes = {
  item: PropTypes.instanceOf(Immutable.Map),
};

export default StepResult;
