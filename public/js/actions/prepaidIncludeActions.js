import { saveEntity, getEntity, clearEntity, updateEntityField } from './entityActions';
import { fetchPrepaidIncludeByIdQuery } from '../common/ApiQueries';

export const clearPrepaidInclude = () => clearEntity('prepaid_include');

export const savePrepaidInclude = (prepaidInclude, action) => saveEntity('prepaidincludes', prepaidInclude, action);

export const updatePrepaidInclude = (path, value) => updateEntityField('prepaid_include', path, value);

export const getPrepaidInclude = (id) => {
  const query = fetchPrepaidIncludeByIdQuery(id);
  return getEntity('prepaid_include', query);
};
