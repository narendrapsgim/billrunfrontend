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
    { id: 'discount_type', title: 'Type', sort: true },
  ];

  const projectFields = {
    key: 1,
    description: 1,
    discount_type: 1,
  };

  return (
    <EntityList
      itemsType="discounts"
      itemType="discount"
      filterFields={filterFields}
      tableFields={tableFields}
      projectFields={projectFields}
      showRevisionBy="key"
    />
  );
};

export default DiscountsList;
