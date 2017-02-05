import React from 'react';
import EntityList from '../EntityList';

const ChargingPlansList = (props) => {
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
    { id: 'code', title: 'External Code', sort: true },
    { id: 'Operation', title: 'Operation', sort: true },
    { id: 'charging_value', title: 'Charging value', sort: true },
  ];

  const projectFields = {
    description: 1,
    name: 1,
    code: 1,
    Operation: 1,
    charging_value: 1,
  };

  const baseFilter = {
    type: 'charging',
    connection_type: 'prepaid',
  };

  return (
    <EntityList
      {...props}
      collection="plans"
      itemsType="charging_plans"
      itemType="charging_plan"
      filterFields={filterFields}
      baseFilter={baseFilter}
      tableFields={tableFields}
      projectFields={projectFields}
    />
  );
};

export default ChargingPlansList;
