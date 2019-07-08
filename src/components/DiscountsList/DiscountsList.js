import React from 'react';
import EntityList from '../EntityList';
import { getFieldName } from '@/common/Util';


const DiscountsList = () => {
  const filterFields = [
    { id: 'description', placeholder: 'Title' },
    { id: 'key', placeholder: 'Key' },
  ];

  const parseType = (item) => {
    return item.get('type', '') === 'percentage'
      ? getFieldName('type_percentage', 'discount')
      : getFieldName('type_monetary', 'discount');
  }

  const tableFields = [
    { id: 'description', title: 'Title', sort: true },
    { id: 'key', title: 'Key', sort: true },
    { id: 'type', title: 'Type', sort: true, parser: parseType },
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
