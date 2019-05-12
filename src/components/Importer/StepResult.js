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
  const result = item.get('result', Immutable.List()) || Immutable.List();

  const getErrorCsvHeaders = () => (
    [...fileContent[0], 'import_error_message', 'import_error_row']
  );

  const getErrorCsvData = () => {
    const rows = [];
    result.forEach((status, rowIndex) => {
      if (status !== true) {
        if (fileContent[rowIndex - 1]) {
          rows.push([...fileContent[rowIndex - 1], status, rowIndex]);
        }
      }
    });
    return rows;
  };

  const rendeDetails = () => (
    <div className="scrollbox">
      { result
        .sortBy((status, key) => parseInt(key))
        .map((status, key) => (
          <dl className="mb0" key={`status_${key}`}>
            <dt>
              {`row ${key} `}
              {status === true && <Label bsStyle="success">Success</Label>}
              {status === false && <Label bsStyle="info">No errors</Label>}
              {status !== false && status !== true && !Immutable.Iterable.isIterable(status) && <Label bsStyle="warning">{status}</Label>}
            </dt>
            { Immutable.Iterable.isIterable(status) && status.map((message, index) => (
              <dd key={`status_error_${key}_${index}`}>
                - <Label bsStyle="danger">{message}</Label>
              </dd>
              ))
              .toArray()
            }
          </dl>
        ))
        .toList()
        .toArray()
      }
    </div>
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
          <Label bsStyle="success">{result.size} records were successfully imported</Label>
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
          <Label bsStyle="danger">{result.size - success.length}</Label> rows were faild import.<br />
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
