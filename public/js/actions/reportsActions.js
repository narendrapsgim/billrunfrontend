import { fetchReportByIdQuery } from '../common/ApiQueries';
import {
  saveEntity,
  getEntity,
  clearEntity,
  updateEntityField,
  deleteEntityField,
  setCloneEntity,
} from './entityActions';

export const setCloneReport = () => setCloneEntity('reports', 'report');

export const clearReport = () => clearEntity('reports');

export const saveReport = (item, action) => dispatch => dispatch(saveEntity('reports', item, action));

export const updateReport = (path, value) => updateEntityField('reports', path, value);

export const deleteReportValue = path => deleteEntityField('reports', path);

export const getReport = id => dispatch => dispatch(getEntity('reports', fetchReportByIdQuery(id)));
