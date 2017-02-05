import React from 'react';
import EntityList from '../EntityList';


const PrepaidIncludesList = (props) => {
  const fields = [
    { id: 'name' },
    { id: 'charging_by', showFilter: false },
    { id: 'charging_by_usaget', showFilter: false },
    { id: 'priority', showFilter: false },
  ];

  const projectFields = {
    name: 1,
    charging_by: 1,
    charging_by_usaget: 1,
    priority: 1,
  };

  return (
    <EntityList
      {...props}
      collection="prepaidincludes"
      itemsType="prepaid_includes"
      itemType="prepaid_include"
      filterFields={fields}
      tableFields={fields}
      projectFields={projectFields}
    />
  );
};


export default PrepaidIncludesList;
