import { saveEntity } from './entityActions';

export const savePrepaidInclude = (prepaidInclude, action) => saveEntity('prepaidincludes', prepaidInclude, action);
