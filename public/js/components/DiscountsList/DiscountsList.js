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
    { id: 'from', title: 'From', type: 'date', cssClass: 'short-date', sort: true },
    { id: 'to', title: 'To', type: 'date', cssClass: 'short-date', sort: true },
  ];

  const projectFields = {
    key: 1,
    description: 1,
    from: 1,
    to: 1,
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
