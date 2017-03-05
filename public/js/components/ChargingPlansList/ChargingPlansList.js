import React from 'react';
import EntityList from '../EntityList';

const ChargingPlansList = () => {
  const filterFields = [
    { id: 'description', placeholder: 'Title' },
    { id: 'name', placeholder: 'Key' },
  ];

  const tableFields = [
    { id: 'description', title: 'Title', sort: true },
    { id: 'name', title: 'Key', sort: true },
    { id: 'code', title: 'External Code', sort: true },
    { id: 'Operation', title: 'Operation', sort: true },
    { id: 'charging_value', title: 'Charging value', sort: true },
  ];

  const projectFields = {
    charging_value: 1,
    description: 1,
    Operation: 1,
    name: 1,
    code: 1,
  };

  const baseFilter = {
    connection_type: { $regex: '^prepaid$' },
    type: { $regex: '^charging$' },
  };

  return (
    <EntityList
      collection="plans"
      itemType="charging_plan"
      itemsType="charging_plans"
      filterFields={filterFields}
      baseFilter={baseFilter}
      tableFields={tableFields}
      projectFields={projectFields}
      showRevisionBy="name"
    />
  );
};

export default ChargingPlansList;
