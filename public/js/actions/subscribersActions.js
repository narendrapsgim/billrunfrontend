export const GOT_SUBSCRIBERS = 'GOT_SUBSCRIBERS';
export const GET_NEW_SUBSCRIBER = 'GET_NEW_SUBSCRIBER';
export const UPDATE_SUBSCRIBER_FIELD = 'UPDATE_SUBSCRIBER_FIELD';

import axios from 'axios';
import Immutable from 'immutable';
import moment from 'moment';
import { showProgressBar, hideProgressBar } from './progressbarActions';

const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: globalSetting.serverUrl
});

export function updateSubscriberField(field_id, value) {
  return {
    type: UPDATE_SUBSCRIBER_FIELD,
    field_id,
    value
  };
}

export function getNewSubscriber(aid = false) {
  return {
    type: GET_NEW_SUBSCRIBER,
    aid
  };
}

function gotSubscribers(subscribers) {
  return {
    type: GOT_SUBSCRIBERS,
    subscribers
  };
}

function fetchSubscribers(aid) {
  //  const fetchUrl = `/api/subscribers?method=query&query={"aid":${aid}, "type":"subscriber"}`;
  const fetchUrl = `/api/find?collection=subscribers&query={"aid":${aid},"type":"subscriber"}`
  return (dispatch) => {
    dispatch(showProgressBar());
    let request = axiosInstance.get(fetchUrl).then(
      resp => {
        const subscribers = _.values(resp.data.details);
        dispatch(gotSubscribers(subscribers));
        dispatch(hideProgressBar());
      }
    ).catch(error => {
      dispatch(hideProgressBar());
    });
  };  
}

export function getSubscribers(aid) {
  return dispatch => {
    return dispatch(fetchSubscribers(aid));
  };
}
