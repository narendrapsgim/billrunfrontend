import { apiBillRun, apiBillRunErrorHandler, apiBillRunSuccessHandler } from '../common/Api';
import {
  fetchReportByIdQuery,
  getReportQuery,
  getCyclesQuery,
  getPlansKeysQuery,
  getServicesKeysWithInfoQuery,
  getProductsKeysQuery,
  getAllGroupsQuery,
  getPrepaidIncludesQuery,
 } from '../common/ApiQueries';
import {
  actions as entityActions,
  saveEntity,
  deleteEntity,
  getEntity,
  clearEntity,
  updateEntityField,
  deleteEntityField,
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

export const setCloneReport = () => ({
  type: entityActions.CLONE_RESET_ENTITY,
  collection: 'reports',
  uniquefields: ['key', 'user', 'creation_time'],
});

export const clearReport = () => clearEntity('reports');

export const saveReport = (item, action) => saveEntity('reports', item, action);

export const deleteReport = item => deleteEntity('reports', item);

export const updateReport = (path, value) => updateEntityField('reports', path, value);

export const deleteReportValue = path => deleteEntityField('reports', path);

export const getReport = id => getEntity('reports', fetchReportByIdQuery(id));

export const getReportData = data => getEntityList('reportData', getReportQuery(data));

export const clearReportData = () => clearItems('reportData');

export const setReportDataListPage = num => setListPage('reportData', num);

export const setReportDataListSize = num => setListSize('reportData', num);

export const getCyclesOptions = () => getList('cycles_list', getCyclesQuery());

export const getPlansOptions = () => getList('available_plans', getPlansKeysQuery());

export const getServicesOptions = () => getList('available_services', getServicesKeysWithInfoQuery());

export const getProductsOptions = () => getList('all_rates', getProductsKeysQuery());

export const getUsageTypesOptions = () => dispatch => dispatch(getSettings('usage_types'));

export const getBucketsOptions = () => getList('pp_includes', getPrepaidIncludesQuery());

export const getFileTypesOptions = () => dispatch => dispatch(getSettings('file_types'));

export const getEventCodeOptions = () => dispatch => dispatch(getSettings('events'));

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
