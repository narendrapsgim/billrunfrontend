import { saveEntity, getEntityById, clearEntity, updateEntityField } from './entityActions';

export const clearPrepaidInclude = () => clearEntity('prepaid_include');

export const savePrepaidInclude = (prepaidInclude, action) => saveEntity('prepaidincludes', prepaidInclude, action);

export const updatePrepaidInclude = (path, value) => updateEntityField('prepaid_include', path, value);

export const getPrepaidInclude = id => getEntityById('prepaid_include', 'prepaidincludes', id);
