import React from 'react';
import EntityList from '../EntityList';


const ReportsList = () => {
  const filterFields = [
    { id: 'key', placeholder: 'Name' },
  ];

  const tableFields = [
    { id: 'key', title: 'Title', sort: true },
    { id: 'user', title: 'User', sort: true },
    { id: 'created', title: 'created', type: 'mongodatetime', cssClass: 'long-date', sort: true },
    { id: 'modified', title: 'Modified', type: 'mongodatetime', cssClass: 'long-date', sort: true },
  ];

  const projectFields = {
    key: 1,
    user: 1,
    created: 1,
    modified: 1,
  };

  const actions = [
    { type: 'view' },
    { type: 'edit', onClickColumn: null },
  ];

  return (
    <EntityList
      collection="reports"
      itemType="report"
      itemsType="reports"
      api="get"
      filterFields={filterFields}
      tableFields={tableFields}
      projectFields={projectFields}
      actions={actions}
    />
  );
};

export default ReportsList;
