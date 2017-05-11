import {
  fetchReportByIdQuery,
  getReportQuery,
  getCyclesQuery,
 } from '../common/ApiQueries';
import {
  saveEntity,
  getEntity,
  clearEntity,
  updateEntityField,
  deleteEntityField,
  setCloneEntity,
} from './entityActions';
import {
  getList as getEntityList,
  clearItems,
  setListPage,
  setListSize,
} from './entityListActions';
import {
  getList,
} from './listActions';

export const setCloneReport = () => setCloneEntity('reports', 'report');

export const clearReport = () => clearEntity('reports');

export const saveReport = (item, action) => dispatch => dispatch(saveEntity('reports', item, action));

export const updateReport = (path, value) => updateEntityField('reports', path, value);

export const deleteReportValue = path => deleteEntityField('reports', path);

export const getReport = id => dispatch => dispatch(getEntity('reports', fetchReportByIdQuery(id)));

export const getReportData = data => dispatch => dispatch(getEntityList('reportData', getReportQuery(data)));

export const clearReportData = () => dispatch => dispatch(clearItems('reportData'));

export const setReportDataListPage = num => dispatch => dispatch(setListPage('reportData', num));

export const setReportDataListSize = num => dispatch => dispatch(setListSize('reportData', num));

export const getCyclesOptions = () => dispatch => dispatch(getList('cycles_list', getCyclesQuery()));
