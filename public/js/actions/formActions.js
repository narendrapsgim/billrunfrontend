import axios from 'axios';
import { showProgressBar, hideProgressBar } from './progressbarActions';
import { showModal } from './modalActions';
import { showStatusMessage } from '../actions';


let axiosInstance = axios.create({
  withCredentials: true,
  baseURL: globalSetting.serverUrl
});


export function saveForm(query) {
  const { coll, type, data, action } = query;

  let saveUrl = '/admin/save';
  var formData = new FormData();
  if (action !== 'new') formData.append('id', data.id);
  formData.append("coll", coll);
  formData.append("type", action);
  formData.append("data", JSON.stringify(data));

  return (dispatch) => {
    dispatch(showProgressBar());
    let request = axiosInstance.post(saveUrl, formData).then(
      resp => {
        dispatch(showStatusMessage("Saved sucessfully!", 'success'));
        dispatch(hideProgressBar());
      }
    ).catch(error => {
      dispatch(showModal(error.data.message, "Error!"));
      dispatch(hideProgressBar());
    });
  };  
}

export function get(query) {
  const { coll, id } = query;
  let fetchUrl = `/api/find?collection=${coll}&query={"_id": {"$in": ["${id}"]}}`;
  return (dispatch) => {
    dispatch(showProgressBar());
    let request = axiosInstance.get(fetchUrl).then(
      resp => {
        let p = _.values(resp.data.details)[0];
        dispatch(gotProduct(convert(p)));
        dispatch(hideProgressBar());
      }
    ).catch(error => {
      dispatch(showModal(error.data.message, "Error!"));
      dispatch(hideProgressBar());
    });
  };
}
