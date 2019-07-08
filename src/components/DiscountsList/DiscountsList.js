import React from 'react';
import EntityList from '../EntityList';


const DiscountsList = () => {
  const filterFields = [
    { id: 'description', placeholder: 'Title' },
    { id: 'key', placeholder: 'Key' },
  ];

  const tableFields = [
    { id: 'description', title: 'Title', sort: true },
    { id: 'key', title: 'Key', sort: true },
    { id: 'type', title: 'Type', sort: true },
  ];

  const projectFields = {
    key: 1,
    description: 1,
    type: 1,
  };

  const actions = [
    { type: 'edit' },
  ];

  return (
    <EntityList
      itemsType="discounts"
      itemType="discount"
      filterFields={filterFields}
      tableFields={tableFields}
      projectFields={projectFields}
      showRevisionBy="key"
      actions={actions}
    />
  );
};

export default DiscountsList;
