import React from 'react';
import EntityList from '../EntityList';

const PrepaidPlansList = () => {
  const filterFields = [
    { id: 'description', placeholder: 'Title' },
    { id: 'name', placeholder: 'Key' },
    { id: 'to', display: false, type: 'datetime', showFilter: false },
    { id: 'connection_type', display: false, showFilter: false },
    { id: 'type', display: false, showFilter: false },
  ];
  const tableFields = [
    { id: 'description', title: 'Title', sort: true },
    { id: 'name', title: 'Key', sort: true },
    { id: 'code', title: 'Code', sort: true },
  ];
  const projectFields = {
    description: 1,
    name: 1,
    code: 1,
  };
  const baseFilter = {
    connection_type: 'prepaid',
    type: 'customer',
  };
  return (
    <EntityList
      itemType="prepaid_plan"
      itemsType="prepaid_plans"
      collection="plans"
      filterFields={filterFields}
      baseFilter={baseFilter}
      tableFields={tableFields}
      projectFields={projectFields}
    />
  );
};


export default PrepaidPlansList;
