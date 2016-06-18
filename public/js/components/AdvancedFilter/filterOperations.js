const filterOperations = {
  in: { name:'in', key: '$in', value: "Equals"},
  regex: { name:'regex', key: '$regex', value: "Contains", description: 'Add ^/& to serch start/end with' },
  ne: { name:'ne', key: '$ne', value: "Not equals" },
  lt: { name:'lt', key: '$lt', value: "Less than" },
  lte: { name:'lte', key: '$lte', value: "Less than or equals" },
  gt: { name:'gt', key: '$gt', value: "Greater than " },
  gte: { name:'gte', key: '$gte', value: "Greater than or equals" },
};

export default filterOperations;
