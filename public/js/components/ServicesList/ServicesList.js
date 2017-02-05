
import React from 'react';
import EntityList from '../EntityList';


const ServicesList = () => {
  const parserPrice = item => item.getIn(['price', 0, 'price'], '');
  const parserCycles = (item) => {
    const unlimited = globalSetting.serviceCycleUnlimitedValue;
    const cycle = item.getIn(['price', 0, 'to'], '');
    return cycle === unlimited ? 'Infinite' : cycle;
  };
  const filterFields = [
    { id: 'description', placeholder: 'Title' },
    { id: 'name', placeholder: 'Key' },
    { id: 'to', showFilter: false, type: 'datetime' },
  ];
  const tableFields = [
    { id: 'description', title: 'Title', sort: true },
    { id: 'name', title: 'Key', sort: true },
    { title: 'Price', parser: parserPrice, sort: true },
    { title: 'Cycles', parser: parserCycles, sort: true },
  ];
  const projectFields = {
    description: 1,
    name: 1,
    price: 1,
  };
  return (
    <EntityList
      itemsType="services"
      itemType="service"
      filterFields={filterFields}
      tableFields={tableFields}
      projectFields={projectFields}
    />
  );
};

export default ServicesList;
