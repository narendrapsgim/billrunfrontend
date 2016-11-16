/**
 * Create Api query object to get users names
 * @type {Object} = { size , page, sort, project, query }
 */
export const userNamesQuery = (
  {
    size = 1000,
    page = 0,
    sort = { username: 1 },
    project = { username: 1 },
    query = {},
  } = {}
) => ({
  api: 'find',
  params: [
    { collection: 'users' },
    { query: JSON.stringify(query) },
    { project: JSON.stringify(project) },
    { sort: JSON.stringify(sort) },
    { size },
    { page },
  ],
});

export const auditTrailEntityTypesQuery = () => {
  const revenueQuery = [{
    $match: { source: 'audit' },
  }, {
    $group: { _id: '$collection' },
  }, {
    $project: { name: '$_id', _id: 0 },
  }, {
    $sort: { name: 1 },
  }];

  const querie = {
    api: 'aggregate',
    params: [
      { collection: 'log' },
      { pipelines: JSON.stringify(revenueQuery) },
    ],
  };

  return querie;
};
