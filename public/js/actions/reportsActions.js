import { apiBillRun, apiBillRunErrorHandler, apiBillRunSuccessHandler } from '../common/Api';
import {
  fetchReportByIdQuery,
  getReportQuery,
  getCyclesQuery,
  getPlansKeysQuery,
  getServicesKeysWithInfoQuery,
  getProductsKeysQuery,
  getAllGroupsQuery,
 } from '../common/ApiQueries';
import {
  saveEntity,
  deleteEntity,
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
  gotList,
  addToList,
} from './listActions';
import { getSettings } from './settingsActions';


export const reportTypes = {
  SIMPLE: 0,
  GROPPED: 1,
};

export const setCloneReport = () => setCloneEntity('reports', 'report');

export const clearReport = () => clearEntity('reports');

export const saveReport = (item, action) => dispatch => dispatch(saveEntity('reports', item, action));

export const deleteReport = item => dispatch => dispatch(deleteEntity('reports', item));

export const updateReport = (path, value) => updateEntityField('reports', path, value);

export const deleteReportValue = path => deleteEntityField('reports', path);

export const getReport = id => dispatch => dispatch(getEntity('reports', fetchReportByIdQuery(id)));

export const getReportData = data => dispatch => dispatch(getEntityList('reportData', getReportQuery(data)));

export const clearReportData = () => dispatch => dispatch(clearItems('reportData'));

export const setReportDataListPage = num => dispatch => dispatch(setListPage('reportData', num));

export const setReportDataListSize = num => dispatch => dispatch(setListSize('reportData', num));

export const getCyclesOptions = () => dispatch => dispatch(getList('cycles_list', getCyclesQuery()));

export const getPlansOptions = () => dispatch => dispatch(getList('available_plans', getPlansKeysQuery()));

export const getServicesOptions = () => dispatch => dispatch(getList('available_services', getServicesKeysWithInfoQuery()));

export const getProductsOptions = () => dispatch => dispatch(getList('all_rates', getProductsKeysQuery()));

export const getUsageTypesOptions = () => dispatch => dispatch(getSettings('usage_types'));

export const getGroupsOptions = () => dispatch => apiBillRun(getAllGroupsQuery())
  .then((success) => {
    try {
      const collection = 'available_groups';
      dispatch(gotList(collection, success.data[0].data.details));
      dispatch(addToList(collection, success.data[1].data.details));
      return dispatch(apiBillRunSuccessHandler(success));
    } catch (e) {
      throw new Error('Error retreiving list');
    }
  })
  .catch(error => dispatch(apiBillRunErrorHandler(error, 'Network error - please refresh and try again')));
